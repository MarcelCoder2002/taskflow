"use client";

import { useFormStatus } from "react-dom";
import { createProject } from "../../../../app/actions/projects";
import Link from "next/link";
import {useActionState} from "react";

function SubmitButton() {
	const { pending } = useFormStatus();

	return (
		<button
			type="submit"
			disabled={pending}
			className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
		>
			{pending ? "Création..." : "Créer le projet"}
		</button>
	);
}

export default function NewProjectPage() {
	const [state, formAction] = useActionState(createProject, null);

	return (
		<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-2xl mx-auto">
				<div className="mb-8">
					<Link
						href="/"
						className="text-sm text-gray-600 hover:text-gray-900"
					>
						← Retour au dashboard
					</Link>
					<h1 className="mt-4 text-3xl font-bold text-gray-900">
						Nouveau Projet
					</h1>
					<p className="mt-2 text-gray-600">
						Créez un nouveau projet pour organiser vos user stories et sprints
					</p>
				</div>

				<div className="bg-white shadow rounded-lg p-6">
					<form action={formAction} className="space-y-6">
						{state?.error?._form && (
							<div className="rounded-md bg-red-50 p-4">
								<p className="text-sm text-red-800">{state.error._form[0]}</p>
							</div>
						)}

						<div>
							<label
								htmlFor="name"
								className="block text-sm font-medium text-gray-700"
							>
								Nom du projet <span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								name="name"
								id="name"
								required
								minLength={3}
								className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
								placeholder="Ex: Application Mobile E-commerce"
							/>
							{state?.error?.name && (
								<p className="mt-1 text-sm text-red-600">
									{state.error.name[0]}
								</p>
							)}
							<p className="mt-1 text-xs text-gray-500">
								Minimum 3 caractères
							</p>
						</div>

						<div>
							<label
								htmlFor="description"
								className="block text-sm font-medium text-gray-700"
							>
								Description
							</label>
							<textarea
								name="description"
								id="description"
								rows={4}
								className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
								placeholder="Décrivez brièvement votre projet..."
							/>
							<p className="mt-1 text-xs text-gray-500">
								Optionnel - Vous pourrez modifier cela plus tard
							</p>
						</div>

						<div className="bg-blue-50 border border-blue-200 rounded-md p-4">
							<h3 className="text-sm font-medium text-blue-900 mb-2">
								💡 Conseil Agile
							</h3>
							<p className="text-sm text-blue-700">
								En tant que créateur du projet, vous serez automatiquement
								assigné comme <strong>Product Owner</strong>. Vous pourrez
								inviter d'autres membres (Scrum Master, Developers) après la
								création.
							</p>
						</div>

						<div className="flex gap-4">
							<Link
								href="/dashboard"
								className="flex-1 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
							>
								Annuler
							</Link>
							<div className="flex-1">
								<SubmitButton />
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}