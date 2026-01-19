import { getProject } from "../../../../../app/actions/projects";
import { getSprints } from "../../../../../app/actions/sprints";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function SprintsPage({
	                                          params,
                                          }: {
	params: Promise<{ id: string }>;
}) {
	let project;
	let sprints;
	
	const { id } = await params;

	try {
		[project, sprints] = await Promise.all([
			getProject(id),
			getSprints(id),
		]);
	} catch (error) {
		notFound();
	}

	const activeSprint = sprints.find((s) => s.status === "ACTIVE");
	const plannedSprints = sprints.filter((s) => s.status === "PLANNED");
	const completedSprints = sprints.filter((s) => s.status === "COMPLETED");

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
							{project.name}
						</Link>
						<span className="mx-2 text-gray-400">/</span>
						<span className="text-sm text-gray-900">Sprints</span>
					</div>

					{/* Header */}
					<div className="mb-8 flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold text-gray-900">Sprints</h1>
							<p className="mt-2 text-gray-600">
								Gérez vos itérations et suivez l&#39;avancement
							</p>
						</div>
						<Link
							href={`/projects/${id}/sprints/new`}
							className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
						>
							+ Nouveau Sprint
						</Link>
					</div>

					{/* Active Sprint */}
					{activeSprint && (
						<div className="mb-6">
							<h2 className="text-lg font-medium text-gray-900 mb-4">
								⚡ Sprint Actif
							</h2>
							<div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
								<div className="flex items-start justify-between mb-4">
									<div>
										<h3 className="text-xl font-semibold text-gray-900">
											{activeSprint.name}
										</h3>
										{activeSprint.goal && (
											<p className="mt-1 text-sm text-gray-600">
												{activeSprint.goal}
											</p>
										)}
									</div>
									<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-600 text-white">
                    EN COURS
                  </span>
								</div>

								<div className="grid grid-cols-3 gap-4 mb-4">
									<div>
										<p className="text-xs text-gray-500">Stories</p>
										<p className="text-lg font-semibold text-gray-900">
											{activeSprint._count.stories}
										</p>
									</div>
									<div>
										<p className="text-xs text-gray-500">Début</p>
										<p className="text-sm text-gray-900">
											{activeSprint.startDate
												? new Date(activeSprint.startDate).toLocaleDateString(
													"fr-FR"
												)
												: "-"}
										</p>
									</div>
									<div>
										<p className="text-xs text-gray-500">Fin prévue</p>
										<p className="text-sm text-gray-900">
											{activeSprint.endDate
												? new Date(activeSprint.endDate).toLocaleDateString(
													"fr-FR"
												)
												: "-"}
										</p>
									</div>
								</div>

								<Link
									href={`/projects/${id}/sprints/${activeSprint.id}/board`}
									className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
								>
									Voir le Board →
								</Link>
							</div>
						</div>
					)}

					{/* Planned Sprints */}
					{plannedSprints.length > 0 && (
						<div className="mb-6">
							<h2 className="text-lg font-medium text-gray-900 mb-4">
								📅 Sprints Planifiés ({plannedSprints.length})
							</h2>
							<div className="space-y-4">
								{plannedSprints.map((sprint) => (
									<div
										key={sprint.id}
										className="bg-white border border-gray-200 rounded-lg p-6"
									>
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<h3 className="text-lg font-semibold text-gray-900">
													{sprint.name}
												</h3>
												{sprint.goal && (
													<p className="mt-1 text-sm text-gray-600">
														{sprint.goal}
													</p>
												)}
												<p className="mt-2 text-xs text-gray-500">
													Durée: {sprint.duration} jours • {sprint._count.stories}{" "}
													stories
												</p>
											</div>
											<div className="flex gap-2">
												<Link
													href={`/projects/${id}/sprints/${sprint.id}/planning`}
													className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
												>
													Planning
												</Link>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Completed Sprints */}
					{completedSprints.length > 0 && (
						<div>
							<h2 className="text-lg font-medium text-gray-900 mb-4">
								✅ Sprints Terminés ({completedSprints.length})
							</h2>
							<div className="space-y-4">
								{completedSprints.map((sprint) => (
									<div
										key={sprint.id}
										className="bg-white border border-gray-200 rounded-lg p-6 opacity-75"
									>
										<div className="flex items-start justify-between">
											<div>
												<h3 className="text-lg font-semibold text-gray-900">
													{sprint.name}
												</h3>
												{sprint.velocity && (
													<p className="mt-1 text-sm text-gray-600">
														Vélocité: {sprint.velocity} points
													</p>
												)}
											</div>
											<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-700">
                        TERMINÉ
                      </span>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Empty State */}
					{sprints.length === 0 && (
						<div className="text-center py-12 bg-white rounded-lg shadow">
							<svg
								className="mx-auto h-12 w-12 text-gray-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M13 10V3L4 14h7v7l9-11h-7z"
								/>
							</svg>
							<h3 className="mt-2 text-sm font-medium text-gray-900">
								Aucun sprint
							</h3>
							<p className="mt-1 text-sm text-gray-500">
								Commencez par créer votre premier sprint
							</p>
							<div className="mt-6">
								<Link
									href={`/projects/${id}/sprints/new`}
									className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
								>
									+ Créer un Sprint
								</Link>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}