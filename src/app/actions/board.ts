"use server";

import { db } from "../../lib/db";
import { auth } from "../../lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateStoryStatus(
	storyId: string,
	status: "TODO" | "IN_PROGRESS" | "DONE"
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
		include: {
			sprint: true,
		},
	});

	if (!story) {
		throw new Error("Story non trouvée");
	}

	// Update story status
	const data: any = { status };

	// Set completedAt when moving to DONE
	if (status === "DONE") {
		data.completedAt = new Date();
	}

	const updated = await db.userStory.update({
		where: { id: storyId },
		data,
	});

	if (story.sprint) {
		revalidatePath(`/projects/${story.projectId}/sprints/${story.sprint.id}/board`);
	}

	return updated;
}

export async function createTask(data: {
	title: string;
	storyId: string;
	estimatedHours?: number;
}) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		throw new Error("Non authentifié");
	}

	const story = await db.userStory.findFirst({
		where: {
			id: data.storyId,
			project: {
				members: {
					some: {
						userId: session.user.id,
					},
				},
			},
		},
		include: {
			sprint: true,
		},
	});

	if (!story) {
		throw new Error("Story non trouvée");
	}

	const task = await db.task.create({
		data: {
			title: data.title,
			storyId: data.storyId,
			estimatedHours: data.estimatedHours,
			status: "TODO",
		},
	});

	if (story.sprint) {
		revalidatePath(`/projects/${story.projectId}/sprints/${story.sprint.id}/board`);
	}

	return task;
}

export async function updateTaskStatus(taskId: string, status: "TODO" | "IN_PROGRESS" | "DONE") {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		throw new Error("Non authentifié");
	}

	const task = await db.task.findFirst({
		where: {
			id: taskId,
			story: {
				project: {
					members: {
						some: {
							userId: session.user.id,
						},
					},
				},
			},
		},
		include: {
			story: {
				include: {
					sprint: true,
				},
			},
		},
	});

	if (!task) {
		throw new Error("Tâche non trouvée");
	}

	const data: any = { status };

	if (status === "DONE") {
		data.completedAt = new Date();
	} else {
		data.completedAt = null;
	}

	const updated = await db.task.update({
		where: { id: taskId },
		data,
	});

	if (task.story.sprint) {
		revalidatePath(`/projects/${task.story.projectId}/sprints/${task.story.sprint.id}/board`);
	}

	return updated;
}

export async function deleteTask(taskId: string) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		throw new Error("Non authentifié");
	}

	const task = await db.task.findFirst({
		where: {
			id: taskId,
			story: {
				project: {
					members: {
						some: {
							userId: session.user.id,
						},
					},
				},
			},
		},
		include: {
			story: {
				include: {
					sprint: true,
				},
			},
		},
	});

	if (!task) {
		throw new Error("Tâche non trouvée");
	}

	await db.task.delete({
		where: { id: taskId },
	});

	if (task.story.sprint) {
		revalidatePath(`/projects/${task.story.projectId}/sprints/${task.story.sprint.id}/board`);
	}

	return { success: true };
}

export async function getSprintBoard(sprintId: string) {
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
			project: {
				select: {
					id: true,
					name: true,
				},
			},
			stories: {
				include: {
					assignee: {
						select: {
							id: true,
							name: true,
							email: true,
						},
					},
					tasks: {
						orderBy: {
							createdAt: "asc",
						},
					},
				},
				orderBy: {
					priority: "asc",
				},
			},
		},
	});

	if (!sprint) {
		throw new Error("Sprint non trouvé");
	}

	return sprint;
}