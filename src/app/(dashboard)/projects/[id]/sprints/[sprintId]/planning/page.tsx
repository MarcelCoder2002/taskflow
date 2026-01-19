import { getSprint } from "../../../../../../../app/actions/sprints";
import { getUserStories } from "../../../../../../../app/actions/user-stories";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SprintPlanningClient } from "./SprintPlanningClient";

export default async function SprintPlanningPage({
	                                                 params,
                                                 }: {
	params: Promise<{ id: string; sprintId: string }>;
}) {
	let sprint;
	let backlogStories;

	const { id, sprintId } = await params;

	try {
		[sprint, backlogStories] = await Promise.all([
			getSprint(sprintId),
			getUserStories(id),
		]);
	} catch (error) {
		notFound();
	}

	// Calculate total points
	const sprintPoints = sprint.stories.reduce(
		(sum, s) => sum + (s.storyPoints || 0),
		0
	);

	// Calculate average velocity (mock for now - will implement later)
	const averageVelocity = 12; // Hardcoded for MVP

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				<div className="px-4 py-6 sm:px-0">
					{/* Breadcrumb */}
					<div className="mb-6">
						<Link
							href="/"
							className="text-sm text-gray-600 hover:text-gray-900"
						>
							Dashboard
						</Link>
						<span className="mx-2 text-gray-400">/</span>
						<Link
							href={`/projects/${id}`}
							className="text-sm text-gray-600 hover:text-gray-900"
						>
							{sprint.project.name}
						</Link>
						<span className="mx-2 text-gray-400">/</span>
						<span className="text-sm text-gray-900">
              {sprint.name} - Planning
            </span>
					</div>

					{/* Header */}
					<div className="mb-8">
						<div className="flex items-center justify-between">
							<div>
								<h1 className="text-3xl font-bold text-gray-900">
									{sprint.name}
								</h1>
								{sprint.goal && (
									<p className="mt-2 text-gray-600">
										<strong>Objectif:</strong> {sprint.goal}
									</p>
								)}
								<p className="mt-1 text-sm text-gray-500">
									Durée: {sprint.duration} jours • Statut:{" "}
									<span
										className={`font-medium ${
											sprint.status === "PLANNED"
												? "text-yellow-600"
												: sprint.status === "ACTIVE"
													? "text-green-600"
													: "text-gray-600"
										}`}
									>
                    {sprint.status}
                  </span>
								</p>
							</div>

							{sprint.status === "PLANNED" && sprint.stories.length > 0 && (
								<form action={`/api/sprints/${sprint.id}/start`} method="POST">
									<button
										type="submit"
										className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
									>
										▶ Démarrer le Sprint
									</button>
								</form>
							)}
						</div>
					</div>

					{/* Stats */}
					<div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
						<div className="bg-white overflow-hidden shadow rounded-lg">
							<div className="p-5">
								<div className="flex items-center">
									<div className="flex-shrink-0">
										<svg
											className="h-6 w-6 text-gray-400"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
											/>
										</svg>
									</div>
									<div className="ml-5">
										<p className="text-sm font-medium text-gray-500">
											Stories Sélectionnées
										</p>
										<p className="text-2xl font-semibold text-gray-900">
											{sprint.stories.length}
										</p>
									</div>
								</div>
							</div>
						</div>

						<div className="bg-white overflow-hidden shadow rounded-lg">
							<div className="p-5">
								<div className="flex items-center">
									<div className="flex-shrink-0">
										<svg
											className="h-6 w-6 text-gray-400"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
											/>
										</svg>
									</div>
									<div className="ml-5">
										<p className="text-sm font-medium text-gray-500">
											Story Points
										</p>
										<p className="text-2xl font-semibold text-gray-900">
											{sprintPoints}
										</p>
									</div>
								</div>
							</div>
						</div>

						<div className="bg-white overflow-hidden shadow rounded-lg">
							<div className="p-5">
								<div className="flex items-center">
									<div className="flex-shrink-0">
										<svg
											className="h-6 w-6 text-gray-400"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
											/>
										</svg>
									</div>
									<div className="ml-5">
										<p className="text-sm font-medium text-gray-500">
											Vélocité Moyenne
										</p>
										<p className="text-2xl font-semibold text-gray-900">
											{averageVelocity}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Warning if over capacity */}
					{sprintPoints > averageVelocity && (
						<div className="mb-6 bg-orange-50 border-l-4 border-orange-400 p-4">
							<div className="flex">
								<div className="flex-shrink-0">
									<svg
										className="h-5 w-5 text-orange-400"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
								<div className="ml-3">
									<p className="text-sm text-orange-700">
										<strong>Capacité dépassée!</strong> Vous avez sélectionné{" "}
										{sprintPoints} points alors que votre vélocité moyenne est
										de {averageVelocity} points. Envisagez de retirer certaines
										stories.
									</p>
								</div>
							</div>
						</div>
					)}

					{/* Client Component */}
					<SprintPlanningClient
						sprint={sprint}
						backlogStories={backlogStories}
						projectId={id}
					/>
				</div>
			</div>
		</div>
	);
}