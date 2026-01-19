"use client";

import { useFormStatus } from "react-dom";
import { createSprint } from "../../../../../../app/actions/sprints";
import Link from "next/link";
import { useParams } from "next/navigation";
import {useActionState} from "react";

function SubmitButton() {
	const { pending } = useFormStatus();
	return (
		<button
			type="submit"
			disabled={pending}
			className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
		>
			{pending ? "Création..." : "Créer le Sprint"}
		</button>
	);
}

export default function NewSprintPage() {
	const params = useParams();
	const projectId = params.id as string;
	const [state, formAction] = useActionState(createSprint, null);

	return (
		<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-2xl mx-auto">
				<div className="mb-8">
					<Link
						href={`/projects/${projectId}`}
						className="text-sm text-gray-600 hover:text-gray-900"
					>
						← Retour au projet
					</Link>
					<h1 className="mt-4 text-3xl font-bold text-gray-900">
						Nouveau Sprint
					</h1>
					<p className="mt-2 text-gray-600">
						Créez un sprint pour planifier votre prochaine itération
					</p>
				</div>

				<div className="bg-white shadow rounded-lg p-6">
					<form action={formAction} className="space-y-6">
						<input type="hidden" name="projectId" value={projectId} />

						{state?.error?._form && (
							<div className="rounded-md bg-red-50 p-4">
								<p className="text-sm text-red-800">{state.error._form[0]}</p>
							</div>
						)}

						{/* Name */}
						<div>
							<label
								htmlFor="name"
								className="block text-sm font-medium text-gray-700"
							>
								Nom du sprint <span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								name="name"
								id="name"
								required
								minLength={3}
								className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
								placeholder="Ex: Sprint 1"
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

						{/* Goal */}
						<div>
							<label
								htmlFor="goal"
								className="block text-sm font-medium text-gray-700"
							>
								Objectif du sprint (Sprint Goal)
							</label>
							<textarea
								name="goal"
								id="goal"
								rows={3}
								className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
								placeholder="Ex: Implémenter l'authentification complète (register + login)"
							/>
							<p className="mt-1 text-xs text-gray-500">
								Décrivez l&#39;objectif principal à atteindre durant ce sprint
							</p>
						</div>

						{/* Duration */}
						<div>
							<label
								htmlFor="duration"
								className="block text-sm font-medium text-gray-700"
							>
								Durée (en jours) <span className="text-red-500">*</span>
							</label>
							<select
								name="duration"
								id="duration"
								required
								defaultValue={7}
								className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
							>
								<option value={7}>1 semaine (7 jours)</option>
								<option value={14}>2 semaines (14 jours)</option>
								<option value={21}>3 semaines (21 jours)</option>
								<option value={28}>4 semaines (28 jours)</option>
							</select>
							<p className="mt-1 text-xs text-gray-500">
								Les sprints Scrum durent généralement entre 1 et 4 semaines
							</p>
						</div>

						{/* Info Box */}
						<div className="bg-blue-50 border border-blue-200 rounded-md p-4">
							<h3 className="text-sm font-medium text-blue-900 mb-2">
								📅 Prochaines étapes
							</h3>
							<ul className="text-sm text-blue-700 space-y-1">
								<li>
									1. Créer le sprint → statut <strong>PLANNED</strong>
								</li>
								<li>
									2. Sélectionner les user stories du backlog (Sprint Planning)
								</li>
								<li>
									3. Démarrer le sprint → statut <strong>ACTIVE</strong>
								</li>
							</ul>
						</div>

						{/* Actions */}
						<div className="flex gap-4">
							<Link
								href={`/projects/${projectId}`}
								className="flex-1 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
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