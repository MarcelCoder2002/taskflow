import {getProject} from "../../../../app/actions/projects";
import Link from "next/link";
import {notFound} from "next/navigation";

export default async function ProjectPage({
	                                          params,
                                          }: {
	params: Promise<{ id: string }>;
}) {
	let project;

	const { id } = await params;

	try {
		project = await getProject(id);
	} catch (error) {
		notFound();
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				<div className="px-4 py-6 sm:px-0">
					<div className="mb-6">
						<Link
							href="/"
							className="text-sm text-gray-600 hover:text-gray-900"
						>
							← Retour au dashboard
						</Link>
					</div>

					<div className="mb-8">
						<h1 className="text-3xl font-bold text-gray-900">
							{project.name}
						</h1>
						{project.description && (
							<p className="mt-2 text-gray-600">{project.description}</p>
						)}
					</div>

					<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
						{/* Stats */}
						<div className="lg:col-span-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
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
										<div className="ml-5 w-0 flex-1">
											<dl>
												<dt className="text-sm font-medium text-gray-500 truncate">
													User Stories
												</dt>
												<dd className="text-3xl font-semibold text-gray-900">
													{project._count.stories}
												</dd>
											</dl>
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
													d="M13 10V3L4 14h7v7l9-11h-7z"
												/>
											</svg>
										</div>
										<div className="ml-5 w-0 flex-1">
											<dl>
												<dt className="text-sm font-medium text-gray-500 truncate">
													Sprints
												</dt>
												<dd className="text-3xl font-semibold text-gray-900">
													{project._count.sprints}
												</dd>
											</dl>
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
													d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
												/>
											</svg>
										</div>
										<div className="ml-5 w-0 flex-1">
											<dl>
												<dt className="text-sm font-medium text-gray-500 truncate">
													Membres
												</dt>
												<dd className="text-3xl font-semibold text-gray-900">
													{project.members.length}
												</dd>
											</dl>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Navigation */}
						<div className="lg:col-span-3">
							<div className="bg-white shadow rounded-lg p-6">
								<h2 className="text-lg font-medium text-gray-900 mb-4">
									Navigation
								</h2>
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
									<Link
										href={`/projects/${project.id}/backlog`}
										className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
									>
										<h3 className="text-sm font-medium text-gray-900">
											📋 Product Backlog
										</h3>
										<p className="mt-1 text-xs text-gray-500">
											Gérer les user stories
										</p>
									</Link>
									<Link
										href={`/projects/${project.id}/sprints`}
										className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
									>
										<h3 className="text-sm font-medium text-gray-900">
											⚡ Sprints
										</h3>
										<p className="mt-1 text-xs text-gray-500">
											Planifier et suivre
										</p>
									</Link>
									<div
										className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center opacity-50 cursor-not-allowed">
										<h3 className="text-sm font-medium text-gray-500">
											📊 Metrics
										</h3>
										<p className="mt-1 text-xs text-gray-400">
											Bientôt disponible
										</p>
									</div>
									<div
										className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center opacity-50 cursor-not-allowed">
										<h3 className="text-sm font-medium text-gray-500">
											⚙️ Paramètres
										</h3>
										<p className="mt-1 text-xs text-gray-400">
											Bientôt disponible
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* Team Members */}
						<div className="lg:col-span-3">
							<div className="bg-white shadow rounded-lg p-6">
								<h2 className="text-lg font-medium text-gray-900 mb-4">
									Équipe ({project.members.length})
								</h2>
								<ul className="divide-y divide-gray-200">
									{project.members.map((member) => (
										<li key={member.id} className="py-3 flex justify-between">
											<div>
												<p className="text-sm font-medium text-gray-900">
													{member.user.name || member.user.email}
												</p>
												<p className="text-sm text-gray-500">
													{member.user.email}
												</p>
											</div>
											<span
												className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {member.role}
                      </span>
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}