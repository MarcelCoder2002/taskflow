import { getProject } from "../../../../../app/actions/projects";
import { getProjectVelocity } from "../../../../../app/actions/metrics";
import { getUserStories } from "../../../../../app/actions/user-stories";
import { getSprints } from "../../../../../app/actions/sprints";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default async function ProjectOverviewPage({
	                                                  params,
                                                  }: {
	params: { id: string };
}) {
	let project, velocity, stories, sprints;

	try {
		[project, velocity, stories, sprints] = await Promise.all([
			getProject(params.id),
			getProjectVelocity(params.id),
			getUserStories(params.id),
			getSprints(params.id),
		]);
	} catch (error) {
		notFound();
	}

	const completedSprints = sprints.filter((s) => s.status === "COMPLETED");
	const activeSprint = sprints.find((s) => s.status === "ACTIVE");

	const totalStories = stories.length;
	const estimatedStories = stories.filter((s) => s.storyPoints).length;
	const totalPoints = stories.reduce((sum, s) => sum + (s.storyPoints || 0), 0);

	// Prepare chart data
	const chartData = velocity.velocities.reverse().map((v) => ({
		name: v.sprintName,
		velocity: v.velocity,
	}));

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
							href={`/projects/${params.id}`}
							className="text-sm text-gray-600 hover:text-gray-900"
						>
							{project.name}
						</Link>
						<span className="mx-2 text-gray-400">/</span>
						<span className="text-sm text-gray-900">Vue d&#39;ensemble</span>
					</div>

					{/* Header */}
					<div className="mb-8">
						<h1 className="text-3xl font-bold text-gray-900">
							Vue d&#39;ensemble - {project.name}
						</h1>
						{project.description && (
							<p className="mt-2 text-gray-600">{project.description}</p>
						)}
					</div>

					{/* Stats Grid */}
					<div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
						<div className="bg-white overflow-hidden shadow rounded-lg">
							<div className="p-5">
								<div className="flex items-center">
									<div className="flex-shrink-0">
										<svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
										</svg>
									</div>
									<div className="ml-5 w-0 flex-1">
										<dl>
											<dt className="text-sm font-medium text-gray-500 truncate">
												User Stories
											</dt>
											<dd className="text-3xl font-semibold text-gray-900">
												{totalStories}
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
										<svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
										</svg>
									</div>
									<div className="ml-5 w-0 flex-1">
										<dl>
											<dt className="text-sm font-medium text-gray-500 truncate">
												Story Points Total
											</dt>
											<dd className="text-3xl font-semibold text-gray-900">
												{totalPoints}
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
										<svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
										</svg>
									</div>
									<div className="ml-5 w-0 flex-1">
										<dl>
											<dt className="text-sm font-medium text-gray-500 truncate">
												Sprints Terminés
											</dt>
											<dd className="text-3xl font-semibold text-gray-900">
												{completedSprints.length}
											</dd>
										</dl>
									</div>
								</div>
							</div>
						</div>

						<div className="bg-blue-50 overflow-hidden shadow rounded-lg border-2 border-blue-200">
							<div className="p-5">
								<div className="flex items-center">
									<div className="flex-shrink-0">
										<svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
										</svg>
									</div>
									<div className="ml-5 w-0 flex-1">
										<dl>
											<dt className="text-sm font-medium text-blue-700 truncate">
												Vélocité Moyenne
											</dt>
											<dd className="text-3xl font-semibold text-blue-900">
												{velocity.averageVelocity}
											</dd>
										</dl>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Velocity Chart */}
					{chartData.length > 0 && (
						<div className="mb-6 bg-white p-6 rounded-lg shadow">
							<h3 className="text-lg font-medium text-gray-900 mb-4">
								Vélocité par Sprint
							</h3>
							<ResponsiveContainer width="100%" height={250}>
								<BarChart data={chartData}>
									<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
									<XAxis dataKey="name" stroke="#6b7280" />
									<YAxis stroke="#6b7280" label={{ value: "Story Points", angle: -90, position: "insideLeft" }} />
									<Tooltip
										contentStyle={{
											backgroundColor: "#fff",
											border: "1px solid #e5e7eb",
											borderRadius: "0.375rem",
										}}
										formatter={(value: number) => [`${value} pts`, "Vélocité"]}
									/>
									<Bar dataKey="velocity" fill="#3b82f6" />
								</BarChart>
							</ResponsiveContainer>

							{velocity.averageVelocity > 0 && (
								<div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-4">
									<p className="text-sm text-blue-800">
										<strong>💡 Recommandation:</strong> Pour les prochains sprints, planifiez environ{" "}
										<strong>{velocity.averageVelocity} story points</strong> pour maintenir un rythme soutenable.
									</p>
								</div>
							)}
						</div>
					)}

					{/* Info Box */}
					<div className="bg-white p-6 rounded-lg shadow">
						<h3 className="text-lg font-medium text-gray-900 mb-3">
							À propos de la vélocité
						</h3>
						<div className="text-sm text-gray-600 space-y-2">
							<p>
								La <strong>vélocité</strong> mesure la quantité de travail (en story points) que votre équipe peut compléter durant un sprint.
							</p>
							<p>
								Elle est calculée comme la moyenne des story points complétés sur les {Math.min(velocity.velocities.length, 3)} derniers sprints terminés.
							</p>
							<p>
								Cette métrique vous aide à planifier de façon réaliste les futurs sprints et à estimer les dates de livraison.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}