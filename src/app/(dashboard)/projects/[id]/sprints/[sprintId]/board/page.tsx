import { getSprintBoard } from "../../../../../../../app/actions/board";
import { notFound } from "next/navigation";
import Link from "next/link";
import { KanbanBoardClient } from "./KanbanBoardClient";

export default async function KanbanBoardPage({
	                                              params,
                                              }: {
	params: Promise<{ id: string; sprintId: string }>;
}) {
	let sprint;

	const { id, sprintId } = await params;

	try {
		sprint = await getSprintBoard(sprintId);
	} catch (error) {
		notFound();
	}

	// Group stories by status
	const todoStories = sprint.stories.filter((s) => s.status === "TODO" || s.status === "BACKLOG" || s.status === "SPRINT");
	const inProgressStories = sprint.stories.filter((s) => s.status === "IN_PROGRESS");
	const doneStories = sprint.stories.filter((s) => s.status === "DONE");

	// Calculate stats
	const totalPoints = sprint.stories.reduce((sum, s) => sum + (s.storyPoints || 0), 0);
	const completedPoints = doneStories.reduce((sum, s) => sum + (s.storyPoints || 0), 0);

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="h-screen flex flex-col">
				{/* Header */}
				<div className="bg-white border-b border-gray-200 px-6 py-4">
					<div className="flex items-center justify-between mb-2">
						<div>
							<Link
								href={`/projects/${id}/sprints`}
								className="text-sm text-gray-600 hover:text-gray-900"
							>
								← Sprints
							</Link>
							<h1 className="mt-1 text-2xl font-bold text-gray-900">
								{sprint.name}
							</h1>
							{sprint.goal && (
								<p className="text-sm text-gray-600">{sprint.goal}</p>
							)}
						</div>

						<div className="flex items-center gap-4">
							{/* Progress */}
							<div className="text-right">
								<p className="text-2xl font-bold text-gray-900">
									{completedPoints}/{totalPoints}
								</p>
								<p className="text-xs text-gray-500">Story Points</p>
							</div>

							<Link
								href={`/projects/${id}/sprints/${sprintId}/metrics`}
								className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
							>
								📊 Métriques
							</Link>

							{sprint.status === "ACTIVE" && (
								<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  ● Sprint Actif
                </span>
							)}
						</div>
					</div>

					{/* Progress Bar */}
					<div className="mt-3">
						<div className="w-full bg-gray-200 rounded-full h-2">
							<div
								className="bg-green-600 h-2 rounded-full transition-all"
								style={{
									width: `${totalPoints > 0 ? (completedPoints / totalPoints) * 100 : 0}%`,
								}}
							/>
						</div>
					</div>
				</div>

				{/* Kanban Board */}
				<div className="flex-1 overflow-hidden">
					<KanbanBoardClient
						sprint={sprint}
						initialTodoStories={todoStories}
						initialInProgressStories={inProgressStories}
						initialDoneStories={doneStories}
					/>
				</div>
			</div>
		</div>
	);
}