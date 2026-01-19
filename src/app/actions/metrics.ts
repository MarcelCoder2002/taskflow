"use server";

import { db } from "../../lib/db";
import { auth } from "../../lib/auth";
import { headers } from "next/headers";

export async function getBurndownData(sprintId: string) {
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
				select: {
					id: true,
					storyPoints: true,
					status: true,
					completedAt: true,
				},
			},
		},
	});

	if (!sprint) {
		throw new Error("Sprint non trouvé");
	}

	if (!sprint.startDate) {
		return {
			sprint,
			burndownData: [],
			ideal: [],
			actual: [],
		};
	}

	const startDate = new Date(sprint.startDate);
	const endDate = sprint.endDate ? new Date(sprint.endDate) : new Date(startDate.getTime() + sprint.duration * 24 * 60 * 60 * 1000);

	const totalPoints = sprint.stories.reduce((sum, s) => sum + (s.storyPoints || 0), 0);

	// Generate ideal burndown
	const ideal: Array<{ day: number; points: number }> = [];
	const daysBetween = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

	for (let i = 0; i <= daysBetween; i++) {
		const remainingPoints = totalPoints - (totalPoints / daysBetween) * i;
		ideal.push({
			day: i,
			points: Math.max(0, Math.round(remainingPoints)),
		});
	}

	// Generate actual burndown
	const actual: Array<{ day: number; points: number }> = [];
	actual.push({ day: 0, points: totalPoints });

	// Group completed stories by day
	const completedByDay = new Map<number, number>();

	sprint.stories.forEach((story) => {
		if (story.completedAt && story.status === "DONE") {
			const completedDate = new Date(story.completedAt);
			const daysSinceStart = Math.floor((completedDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

			if (daysSinceStart >= 0 && daysSinceStart <= daysBetween) {
				const current = completedByDay.get(daysSinceStart) || 0;
				completedByDay.set(daysSinceStart, current + (story.storyPoints || 0));
			}
		}
	});

	// Build actual burndown line
	let remainingPoints = totalPoints;
	for (let i = 1; i <= daysBetween; i++) {
		const completedToday = completedByDay.get(i) || 0;
		remainingPoints -= completedToday;
		actual.push({
			day: i,
			points: Math.max(0, remainingPoints),
		});
	}

	return {
		sprint,
		totalPoints,
		completedPoints: totalPoints - remainingPoints,
		ideal,
		actual,
	};
}

export async function getProjectVelocity(projectId: string) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		throw new Error("Non authentifié");
	}

	const sprints = await db.sprint.findMany({
		where: {
			projectId,
			status: "COMPLETED",
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
				where: {
					status: "DONE",
				},
				select: {
					storyPoints: true,
				},
			},
		},
		orderBy: {
			endDate: "desc",
		},
		take: 5, // Last 5 sprints
	});

	const velocities = sprints.map((sprint) => {
		const velocity = sprint.stories.reduce((sum, s) => sum + (s.storyPoints || 0), 0);
		return {
			sprintName: sprint.name,
			velocity,
			endDate: sprint.endDate,
		};
	});

	const averageVelocity = velocities.length > 0
		? Math.round(velocities.reduce((sum, v) => sum + v.velocity, 0) / velocities.length)
		: 0;

	return {
		velocities,
		averageVelocity,
	};
}