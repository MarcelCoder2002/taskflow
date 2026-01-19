"use client";

import { useState } from "react";
import { updateUserStory } from "../../app/actions/user-stories";

const FIBONACCI_VALUES = [1, 2, 3, 5, 8, 13, 21];
const SPECIAL_VALUES = {
	unknown: "?",
	tooLarge: "☕",
};

const TOOLTIPS = {
	"?": "Story trop floue, à affiner lors du refinement",
	"☕": "Story trop grosse, à découper en stories plus petites",
};

export function StoryPointPicker({
	                                 storyId,
	                                 currentPoints,
	                                 onClose,
                                 }: {
	storyId: string;
	currentPoints: number | null;
	onClose: () => void;
}) {
	const [selectedPoints, setSelectedPoints] = useState<number | null>(
		currentPoints
	);
	const [isSaving, setIsSaving] = useState(false);

	async function handleSave() {
		if (selectedPoints === currentPoints) {
			onClose();
			return;
		}

		setIsSaving(true);
		try {
			await updateUserStory(storyId, { storyPoints: selectedPoints });
			onClose();
		} catch (error) {
			console.error(error);
			alert("Erreur lors de la sauvegarde");
			setIsSaving(false);
		}
	}

	return (
		<div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
				<div className="mb-6">
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						Estimation en Story Points
					</h3>
					<p className="text-sm text-gray-600">
						Sélectionnez la complexité selon la suite de Fibonacci
					</p>
				</div>

				{/* Fibonacci Values */}
				<div className="mb-6">
					<p className="text-xs font-medium text-gray-700 mb-3">
						Suite de Fibonacci
					</p>
					<div className="grid grid-cols-7 gap-2">
						{FIBONACCI_VALUES.map((value) => (
							<button
								key={value}
								onClick={() => setSelectedPoints(value)}
								className={`
                  h-12 rounded-lg border-2 font-semibold text-lg transition-all
                  ${
									selectedPoints === value
										? "border-blue-500 bg-blue-50 text-blue-700"
										: "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
								}
                `}
							>
								{value}
							</button>
						))}
					</div>
				</div>

				{/* Special Values */}
				<div className="mb-6">
					<p className="text-xs font-medium text-gray-700 mb-3">
						Valeurs spéciales
					</p>
					<div className="grid grid-cols-2 gap-3">
						<button
							onClick={() => setSelectedPoints(null)}
							className={`
                relative h-16 rounded-lg border-2 font-semibold text-2xl transition-all group
                ${
								selectedPoints === null
									? "border-yellow-500 bg-yellow-50 text-yellow-700"
									: "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
							}
              `}
						>
							{SPECIAL_VALUES.unknown}
							<div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block">
								<div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
									{TOOLTIPS["?"]}
								</div>
							</div>
						</button>

						<button
							onClick={() => setSelectedPoints(-1)}
							className={`
                relative h-16 rounded-lg border-2 font-semibold text-2xl transition-all group
                ${
								selectedPoints === -1
									? "border-orange-500 bg-orange-50 text-orange-700"
									: "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
							}
              `}
						>
							{SPECIAL_VALUES.tooLarge}
							<div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block">
								<div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
									{TOOLTIPS["☕"]}
								</div>
							</div>
						</button>
					</div>
				</div>

				{/* Info Box */}
				<div className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-3">
					<p className="text-xs text-blue-800">
						<strong>💡 Planning Poker:</strong> Ces valeurs suivent la suite de
						Fibonacci pour refléter l&#39;incertitude croissante. Plus le nombre
						est élevé, plus la story est complexe.
					</p>
				</div>

				{/* Selected Info */}
				{selectedPoints !== null && selectedPoints !== currentPoints && (
					<div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
						<p className="text-sm text-green-800">
							{selectedPoints === -1 ? (
								<>
									<strong>☕ Story trop grosse:</strong> Découpez cette story en
									plusieurs stories plus petites
								</>
							) : (
								<>
									<strong>Nouvelle estimation:</strong> {selectedPoints} story
									points
								</>
							)}
						</p>
					</div>
				)}

				{/* Actions */}
				<div className="flex gap-3">
					<button
						onClick={onClose}
						className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
					>
						Annuler
					</button>
					<button
						onClick={handleSave}
						disabled={isSaving || selectedPoints === currentPoints}
						className="flex-1 px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isSaving ? "Enregistrement..." : "Valider"}
					</button>
				</div>
			</div>
		</div>
	);
}