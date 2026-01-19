"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createUserStory } from "../../app/actions/user-stories";

function SubmitButton() {
	const { pending } = useFormStatus();
	return (
		<button
			type="submit"
			disabled={pending}
			className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
		>
			{pending ? "Création..." : "Créer la User Story"}
		</button>
	);
}

export function CreateUserStoryModal({
	                                     projectId,
	                                     onClose,
                                     }: {
	projectId: string;
	onClose: () => void;
}) {
	const [state, formAction] = useActionState(createUserStory, null);

	// Close on success
	if (state?.success) {
		onClose();
	}

	return (
		<div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
				<div className="p-6">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-2xl font-bold text-gray-900">
							Nouvelle User Story
						</h2>
						<button
							onClick={onClose}
							className="text-gray-400 hover:text-gray-600"
						>
							<svg
								className="w-6 h-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>

					<form action={formAction} className="space-y-4">
						<input type="hidden" name="projectId" value={projectId} />

						{state?.error?.projectId && (
							<div className="rounded-md bg-red-50 p-4">
								<p className="text-sm text-red-800">{state.error.projectId[0]}</p>
							</div>
						)}

						{/* Title */}
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Titre <span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								name="title"
								required
								minLength={3}
								className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
								placeholder="Ex: Créer un compte utilisateur"
							/>
							{state?.error?.title && (
								<p className="mt-1 text-sm text-red-600">
									{state.error.title[0]}
								</p>
							)}
						</div>

						{/* Agile Format Section */}
						<div className="bg-blue-50 border border-blue-200 rounded-md p-4 space-y-3">
							<h3 className="text-sm font-medium text-blue-900">
								Format Agile
							</h3>

							<div>
								<label className="block text-sm font-medium text-gray-700">
									En tant que... <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									name="asA"
									required
									className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
									placeholder="Ex: utilisateur non inscrit"
								/>
								{state?.error?.asA && (
									<p className="mt-1 text-sm text-red-600">
										{state.error.asA[0]}
									</p>
								)}
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700">
									Je veux... <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									name="iWant"
									required
									className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
									placeholder="Ex: créer un compte avec email et mot de passe"
								/>
								{state?.error?.iWant && (
									<p className="mt-1 text-sm text-red-600">
										{state.error.iWant[0]}
									</p>
								)}
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700">
									Afin de... <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									name="soThat"
									required
									className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
									placeholder="Ex: accéder à l'application et gérer mes projets"
								/>
								{state?.error?.soThat && (
									<p className="mt-1 text-sm text-red-600">
										{state.error.soThat[0]}
									</p>
								)}
							</div>
						</div>

						{/* Acceptance Criteria */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Critères d&#39;acceptation
							</label>
							<textarea
								name="acceptanceCriteria"
								rows={4}
								className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
								placeholder="Un critère par ligne. Format: Étant donné que... lorsque... alors...

Exemple:
Étant donné que je suis sur la page d'inscription, lorsque je saisis email valide + mot de passe (min 8 caractères), alors un compte est créé
Étant donné que j'utilise un email déjà existant, lorsque je valide, alors un message d'erreur s'affiche"
							/>
							<p className="mt-1 text-xs text-gray-500">
								Format Given/When/Then recommandé
							</p>
						</div>

						{/* Info Box */}
						<div className="bg-gray-50 border border-gray-200 rounded-md p-3">
							<p className="text-xs text-gray-600">
								💡 <strong>Conseil:</strong> Une bonne user story suit le
								principe INVEST (Independent, Negotiable, Valuable, Estimable,
								Small, Testable). Vous pourrez estimer la complexité en story
								points après création.
							</p>
						</div>

						{/* Actions */}
						<div className="flex gap-3 pt-4">
							<button
								type="button"
								onClick={onClose}
								className="flex-1 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
							>
								Annuler
							</button>
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