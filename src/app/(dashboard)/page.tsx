import { auth } from "../../lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getProjects } from "@/app/actions/projects";
import Link from "next/link";

export default async function DashboardPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/login");
	}

	const projects = await getProjects();

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				<div className="px-4 py-6 sm:px-0">
					<div className="mb-8">
						<h1 className="text-3xl font-bold text-gray-900">
							Bienvenue, {session.user.name || session.user.email} 👋
						</h1>
						<p className="mt-2 text-gray-600">
							Gérez vos projets agiles en toute simplicité
						</p>
					</div>

					<div className="bg-white shadow rounded-lg p-6">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-xl font-semibold text-gray-900">
								Mes Projets ({projects.length})
							</h2>
							<Link
								href="/projects/new"
								className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
							>
								+ Nouveau Projet
							</Link>
						</div>

						{projects.length === 0 ? (
							<div className="text-center py-12">
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
										d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
									/>
								</svg>
								<h3 className="mt-2 text-sm font-medium text-gray-900">
									Aucun projet
								</h3>
								<p className="mt-1 text-sm text-gray-500">
									Commencez par créer votre premier projet
								</p>
							</div>
						) : (
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
								{projects.map((project) => {
									const userRole = project.members.find(
										(m) => m.userId === session.user.id
									)?.role;

									return (
										<Link
											key={project.id}
											href={`/projects/${project.id}`}
											className="block group"
										>
											<div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
												<div className="flex items-start justify-between">
													<h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">
														{project.name}
													</h3>
													<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {userRole}
                          </span>
												</div>
												{project.description && (
													<p className="mt-2 text-sm text-gray-500 line-clamp-2">
														{project.description}
													</p>
												)}
												<div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
													<span>{project._count.stories} stories</span>
													<span>•</span>
													<span>{project._count.sprints} sprints</span>
													<span>•</span>
													<span>{project.members.length} membres</span>
												</div>
											</div>
										</Link>
									);
								})}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}