"use server";

import { db } from "../../lib/db";
import { auth } from "../../lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Validation schema
const createProjectSchema = z.object({
	name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
	description: z.string().optional(),
});

export async function createProject(previousState: unknown, formData: FormData) {
	// Auth check
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		throw new Error("Non authentifié");
	}

	// Validate input
	const validatedFields = createProjectSchema.safeParse({
		name: formData.get("name"),
		description: formData.get("description"),
	});

	if (!validatedFields.success) {
		return {
			error: validatedFields.error.flatten().fieldErrors,
		};
	}

	const { name, description } = validatedFields.data;

	try {
		// Create project
		const project = await db.project.create({
			data: {
				name,
				description: description || null,
				members: {
					create: {
						userId: session.user.id,
						role: "PO", // Creator is Product Owner by default
					},
				},
			},
		});

		revalidatePath("/");
		redirect(`/projects/${project.id}`);
	} catch (error) {
		console.error("Error creating project:", error);
		return {
			error: { _form: ["Une erreur est survenue lors de la création"] },
		};
	}
}

export async function getProjects() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return [];
	}

	const projects = await db.project.findMany({
		where: {
			members: {
				some: {
					userId: session.user.id,
				},
			},
		},
		include: {
			members: {
				include: {
					user: {
						select: {
							id: true,
							name: true,
							email: true,
						},
					},
				},
			},
			_count: {
				select: {
					stories: true,
					sprints: true,
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	return projects;
}

export async function getProject(projectId: string) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		throw new Error("Non authentifié");
	}

	const project = await db.project.findFirst({
		where: {
			id: projectId,
			members: {
				some: {
					userId: session.user.id,
				},
			},
		},
		include: {
			members: {
				include: {
					user: {
						select: {
							id: true,
							name: true,
							email: true,
						},
					},
				},
			},
			_count: {
				select: {
					stories: true,
					sprints: true,
				},
			},
		},
	});

	if (!project) {
		throw new Error("Projet non trouvé");
	}

	return project;
}