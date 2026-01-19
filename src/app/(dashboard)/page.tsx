// src/app/(dashboard)/dashboard/page.tsx
import { redirect } from "next/navigation";
import { auth } from "../../lib/auth";
import { headers } from "next/headers";

export default async function DashboardPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/login");
	}

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
								Mes Projets
							</h2>
							<a
								href="/projects/new"
								className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
							>
								+ Nouveau Projet
							</a>
						</div>

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
					</div>
				</div>
			</div>
		</div>
	);
}