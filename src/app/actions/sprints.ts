"use server";

import { db } from "../../lib/db";
import { auth } from "../../lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const createSprintSchema = z.object({
	name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
	goal: z.string().optional(),
	duration: z.coerce.number().min(1).max(28),
	projectId: z.string(),
});

export async function createSprint(currentState: unknown, formData: FormData) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		throw new Error("Non authentifié");
	}

	const validatedFields = createSprintSchema.safeParse({
		name: formData.get("name"),
		goal: formData.get("goal"),
		duration: formData.get("duration"),
		projectId: formData.get("projectId"),
	});

	if (!validatedFields.success) {
		return {
			error: validatedFields.error.flatten().fieldErrors,
		};
	}

	const { projectId, ...data } = validatedFields.data;

	// Check access
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
		const sprint = await db.sprint.create({
			data: {
				...data,
				projectId,
				status: "PLANNED",
			},
		});

		revalidatePath(`/projects/${projectId}/sprints`);
		redirect(`/projects/${projectId}/sprints/${sprint.id}/planning`);
	} catch (error) {
		console.error("Error creating sprint:", error);
		return {
			error: { _form: ["Une erreur est survenue"] },
		};
	}
}

export async function getSprints(projectId: string) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return [];
	}

	const sprints = await db.sprint.findMany({
		where: {
			projectId,
			project: {
				members: {
					some: {
						userId: session.user.id,
					},
				},
			},
		},
		include: {
			_count: {
				select: {
					stories: true,
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	return sprints;
}

export async function getSprint(sprintId: string) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		throw new Error("Non authentifié");
	}

	const sprint = await db.sprint.findFirst({
		where: {
			id: sprintId,
			project: {
				members: {
					some: {
						userId: session.user.id,
					},
				},
			},
		},
		include: {
			stories: {
				include: {
					assignee: true,
					_count: {
						select: {
							tasks: true,
						},
					},
				},
				orderBy: {
					priority: "asc",
				},
			},
			project: {
				select: {
					id: true,
					name: true,
				},
			},
		},
	});

	if (!sprint) {
		throw new Error("Sprint non trouvé");
	}

	return sprint;
}

export async function startSprint(sprintId: string) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		throw new Error("Non authentifié");
	}

	const sprint = await db.sprint.findFirst({
		where: {
			id: sprintId,
			project: {
				members: {
					some: {
						userId: session.user.id,
					},
				},
			},
		},
	});

	if (!sprint) {
		throw new Error("Sprint non trouvé");
	}

	if (sprint.status !== "PLANNED") {
		throw new Error("Le sprint n'est pas en statut PLANNED");
	}

	const startDate = new Date();
	const endDate = new Date();
	endDate.setDate(endDate.getDate() + sprint.duration);

	const updated = await db.sprint.update({
		where: { id: sprintId },
		data: {
			status: "ACTIVE",
			startDate,
			endDate,
		},
	});

	revalidatePath(`/projects/${sprint.projectId}/sprints`);
	revalidatePath(`/projects/${sprint.projectId}/sprints/${sprintId}`);

	return updated;
}

export async function addStoryToSprint(storyId: string, sprintId: string) {
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
		data: {
			sprintId,
			status: "SPRINT",
		},
	});

	revalidatePath(`/projects/${story.projectId}/backlog`);
	revalidatePath(`/projects/${story.projectId}/sprints/${sprintId}/planning`);

	return updated;
}

export async function removeStoryFromSprint(storyId: string) {
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
		data: {
			sprintId: null,
			status: "BACKLOG",
		},
	});

	revalidatePath(`/projects/${story.projectId}/backlog`);
	if (story.sprintId) {
		revalidatePath(`/projects/${story.projectId}/sprints/${story.sprintId}/planning`);
	}

	return updated;
}