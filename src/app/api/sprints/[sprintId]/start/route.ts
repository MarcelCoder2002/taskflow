import { startSprint } from "@/app/actions/sprints";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ sprintId: string }> }
) {
	const { sprintId } = await params;
	try {
		const sprint = await startSprint(sprintId);

		return NextResponse.redirect(
			new URL(`/projects/${sprint.projectId}/sprints`, request.url)
		);
	} catch (error) {
		console.error("Error starting sprint:", error);
		return NextResponse.json(
			{ error: "Erreur lors du démarrage du sprint" },
			{ status: 500 }
		);
	}
}