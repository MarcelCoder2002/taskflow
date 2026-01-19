"use server";

import { db } from "../../lib/db";
import { auth } from "../../lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Validation schema
const createUserStorySchema = z.object({
	title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
	asA: z.string().min(1, "Ce champ est obligatoire"),
	iWant: z.string().min(1, "Ce champ est obligatoire"),
	soThat: z.string().min(1, "Ce champ est obligatoire"),
	acceptanceCriteria: z.array(z.string()).optional(),
	projectId: z.string(),
});

export async function createUserStory(currentState: unknown, formData: FormData) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		throw new Error("Non authentifié");
	}

	// Parse acceptance criteria from textarea
	const criteriaText = formData.get("acceptanceCriteria") as string;
	const acceptanceCriteria = criteriaText
		? criteriaText.split("\n").filter((line) => line.trim())
		: [];

	const validatedFields = createUserStorySchema.safeParse({
		title: formData.get("title"),
		asA: formData.get("asA"),
		iWant: formData.get("iWant"),
		soThat: formData.get("soThat"),
		acceptanceCriteria,
		projectId: formData.get("projectId"),
	});

	if (!validatedFields.success) {
		return {
			error: validatedFields.error.flatten().fieldErrors,
		};
	}

	const { projectId, ...data } = validatedFields.data;

	// Check user has access to project
	const project = await db.project.findFirst({
		where: {
			id: projectId,
			members: {
				some: {
					userId: session.user.id,
				},
			},
		},
	});

	if (!project) {
		return {
			error: { _form: ["Projet non trouvé"] },
		};
	}

	try {
		// Get max priority to append at end
		const maxPriority = await db.userStory.findFirst({
			where: { projectId },
			orderBy: { priority: "desc" },
			select: { priority: true },
		});

		const story = await db.userStory.create({
			data: {
				...data,
				projectId,
				priority: (maxPriority?.priority ?? 0) + 1,
				status: "BACKLOG",
			},
		});

		revalidatePath(`/projects/${projectId}/backlog`);
		return { success: true, storyId: story.id };
	} catch (error) {
		console.error("Error creating user story:", error);
		return {
			error: { _form: ["Une erreur est survenue"] },
		};
	}
}

export async function getUserStories(projectId: string) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return [];
	}

	const stories = await db.userStory.findMany({
		where: {
			projectId,
			status: "BACKLOG",
			project: {
				members: {
					some: {
						userId: session.user.id,
					},
				},
			},
		},
		include: {
			assignee: {
				select: {
					id: true,
					name: true,
					email: true,
				},
			},
			sprint: {
				select: {
					id: true,
					name: true,
				},
			},
			_count: {
				select: {
					tasks: true,
				},
			},
		},
		orderBy: {
			priority: "asc",
		},
	});

	return stories;
}

export async function updateUserStory(
	storyId: string,
	data: {
		title?: string;
		asA?: string;
		iWant?: string;
		soThat?: string;
		acceptanceCriteria?: string[];
		storyPoints?: number;
	}
) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		throw new Error("Non authentifié");
	}

	const story = await db.userStory.findFirst({
		where: {
			id: storyId,
			project: {
				members: {
					some: {
						userId: session.user.id,
					},
				},
			},
		},
	});

	if (!story) {
		throw new Error("Story non trouvée");
	}

	const updated = await db.userStory.update({
		where: { id: storyId },
		data,
	});

	revalidatePath(`/projects/${story.projectId}/backlog`);
	return updated;
}

export async function deleteUserStory(storyId: string) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		throw new Error("Non authentifié");
	}

	const story = await db.userStory.findFirst({
		where: {
			id: storyId,
			project: {
				members: {
					some: {
						userId: session.user.id,
					},
				},
			},
		},
	});

	if (!story) {
		throw new Error("Story non trouvée");
	}

	await db.userStory.delete({
		where: { id: storyId },
	});

	revalidatePath(`/projects/${story.projectId}/backlog`);
	return { success: true };
}