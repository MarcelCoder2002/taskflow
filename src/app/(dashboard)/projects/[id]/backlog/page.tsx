import { getProject } from "../../../../../app/actions/projects";
import { getUserStories } from "../../../../../app/actions/user-stories";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BacklogClient } from "./BacklogClient";

export default async function BacklogPage({
	                                          params,
                                          }: {
	params: Promise<{ id: string }>;
}) {
	let project;
	let stories;

	const { id } = await params;

	try {
		[project, stories] = await Promise.all([
			getProject(id),
			getUserStories(id),
		]);
	} catch (error) {
		notFound();
	}

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
						<span className="text-sm text-gray-900">Product Backlog</span>
					</div>

					{/* Header */}
					<div className="mb-8">
						<h1 className="text-3xl font-bold text-gray-900">
							Product Backlog
						</h1>
						<p className="mt-2 text-gray-600">
							Gérez et priorisez vos user stories au format agile
						</p>
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
											Total Stories
										</p>
										<p className="text-2xl font-semibold text-gray-900">
											{stories.length}
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
												d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
									</div>
									<div className="ml-5">
										<p className="text-sm font-medium text-gray-500">
											Estimées
										</p>
										<p className="text-2xl font-semibold text-gray-900">
											{stories.filter((s) => s.storyPoints).length}
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
											{stories.reduce((sum, s) => sum + (s.storyPoints || 0), 0)}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Client Component */}
					<BacklogClient projectId={id} initialStories={stories} />
				</div>
			</div>
		</div>
	);
}