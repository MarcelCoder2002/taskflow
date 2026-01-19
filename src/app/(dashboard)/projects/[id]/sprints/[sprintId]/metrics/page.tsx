import { getBurndownData } from "../../../../../../../app/actions/metrics";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BurndownChart } from "../../../../../../../components/charts/BurndownChart";

export default async function MetricsPage({
	                                          params,
                                          }: {
	params: Promise<{ id: string; sprintId: string }>;
}) {
	let burndownData;

	const { id, sprintId } = await params;

	try {
		burndownData = await getBurndownData(sprintId);
	} catch (error) {
		notFound();
	}

	const { sprint, totalPoints, completedPoints, ideal, actual } = burndownData;

	// Combine ideal and actual for chart
	const chartData = ideal.map((idealPoint, index) => ({
		day: idealPoint.day,
		ideal: idealPoint.points,
		actual: actual[index]?.points ?? idealPoint.points,
	}));

	const progressPercentage = totalPoints! > 0 ? Math.round((completedPoints! / totalPoints!) * 100) : 0;

	// Calculate velocity for this sprint
	const velocity = completedPoints;

	// Determine if ahead/behind/on track
	const currentDay = actual.length - 1;
	const idealAtCurrentDay = ideal[currentDay]?.points || 0;
	const actualAtCurrentDay = actual[currentDay]?.points || 0;

	let status: "ahead" | "behind" | "on-track" = "on-track";
	if (actualAtCurrentDay < idealAtCurrentDay - 2) {
		status = "ahead";
	} else if (actualAtCurrentDay > idealAtCurrentDay + 2) {
		status = "behind";
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
							Projet
						</Link>
						<span className="mx-2 text-gray-400">/</span>
						<Link
							href={`/projects/${id}/sprints`}
							className="text-sm text-gray-600 hover:text-gray-900"
						>
							Sprints
						</Link>
						<span className="mx-2 text-gray-400">/</span>
						<span className="text-sm text-gray-900">Métriques</span>
					</div>

					{/* Header */}
					<div className="mb-8">
						<h1 className="text-3xl font-bold text-gray-900">
							Métriques - {sprint.name}
						</h1>
						{sprint.goal && (
							<p className="mt-2 text-gray-600">{sprint.goal}</p>
						)}
					</div>

					{/* Status Alert */}
					{sprint.status === "ACTIVE" && (
						<>
							{status === "ahead" && (
								<div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
									<div className="flex">
										<div className="flex-shrink-0">
											<svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
												<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
											</svg>
										</div>
										<div className="ml-3">
											<p className="text-sm text-green-700">
												<strong>En avance!</strong> Vous êtes au-dessus de la courbe idéale. Excellent rythme!
											</p>
										</div>
									</div>
								</div>
							)}

							{status === "behind" && (
								<div className="mb-6 bg-orange-50 border-l-4 border-orange-400 p-4">
									<div className="flex">
										<div className="flex-shrink-0">
											<svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
												<path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
											</svg>
										</div>
										<div className="ml-3">
											<p className="text-sm text-orange-700">
												<strong>En retard</strong> - Il reste {actualAtCurrentDay} points alors que l&#39;idéal est {idealAtCurrentDay}. Envisagez de retirer des stories du sprint.
											</p>
										</div>
									</div>
								</div>
							)}

							{status === "on-track" && (
								<div className="mb-6 bg-blue-50 border-l-4 border-blue-400 p-4">
									<div className="flex">
										<div className="flex-shrink-0">
											<svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
												<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
											</svg>
										</div>
										<div className="ml-3">
											<p className="text-sm text-blue-700">
												<strong>Sur la bonne voie</strong> - Le sprint progresse selon le planning.
											</p>
										</div>
									</div>
								</div>
							)}
						</>
					)}

					{/* Stats Grid */}
					<div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
						<div className="bg-white overflow-hidden shadow rounded-lg">
							<div className="p-5">
								<div className="flex items-center">
									<div className="flex-shrink-0">
										<svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
										</svg>
									</div>
									<div className="ml-5 w-0 flex-1">
										<dl>
											<dt className="text-sm font-medium text-gray-500 truncate">
												Total Points
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
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
									</div>
									<div className="ml-5 w-0 flex-1">
										<dl>
											<dt className="text-sm font-medium text-gray-500 truncate">
												Points Complétés
											</dt>
											<dd className="text-3xl font-semibold text-gray-900">
												{completedPoints}
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
												Progression
											</dt>
											<dd className="text-3xl font-semibold text-gray-900">
												{progressPercentage}%
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
												Vélocité
											</dt>
											<dd className="text-3xl font-semibold text-gray-900">
												{velocity}
											</dd>
										</dl>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Burndown Chart */}
					{chartData.length > 0 ? (
						<BurndownChart data={chartData} totalPoints={totalPoints!} />
					) : (
						<div className="bg-white p-6 rounded-lg shadow text-center py-12">
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
									d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
								/>
							</svg>
							<h3 className="mt-2 text-sm font-medium text-gray-900">
								Pas encore de données
							</h3>
							<p className="mt-1 text-sm text-gray-500">
								Le burndown chart apparaîtra une fois le sprint démarré
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}