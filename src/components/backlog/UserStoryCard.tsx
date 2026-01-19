"use client";

import { useState } from "react";
import { deleteUserStory } from "../../app/actions/user-stories";
import { StoryPointPicker } from "./StoryPointPicker";

type UserStory = {
	id: string;
	title: string;
	asA: string;
	iWant: string;
	soThat: string;
	storyPoints: number | null;
	acceptanceCriteria: string[];
	assignee: {
		id: string;
		name: string | null;
		email: string;
	} | null;
	_count: {
		tasks: number;
	};
};

export function UserStoryCard({
	                              story,
	                              onEdit,
                              }: {
	story: UserStory;
	onEdit?: (story: UserStory) => void;
}) {
	const [isDeleting, setIsDeleting] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);
	const [showEstimation, setShowEstimation] = useState(false);

	async function handleDelete() {
		if (!confirm("Êtes-vous sûr de vouloir supprimer cette user story ?")) {
			return;
		}

		setIsDeleting(true);
		try {
			await deleteUserStory(story.id);
		} catch (error) {
			console.error(error);
			alert("Erreur lors de la suppression");
			setIsDeleting(false);
		}
	}

	return (
		<div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
			{/* Header */}
			<div className="flex items-start justify-between mb-3">
				<h3 className="text-sm font-medium text-gray-900 flex-1">
					{story.title}
				</h3>
				<div className="flex items-center gap-2 ml-4">
					{story.storyPoints && story.storyPoints > 0 ? (
						<button
							onClick={() => setShowEstimation(true)}
							className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold hover:bg-blue-200 transition-colors"
							title="Modifier l'estimation"
						>
							{story.storyPoints}
						</button>
					) : story.storyPoints === -1 ? (
						<button
							onClick={() => setShowEstimation(true)}
							className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-800 text-sm font-semibold hover:bg-orange-200 transition-colors"
							title="Story trop grosse - Cliquer pour réestimer"
						>
							☕
						</button>
					) : story.storyPoints === null ? (
						<button
							onClick={() => setShowEstimation(true)}
							className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
							title="Cliquer pour estimer"
						>
							Non estimé
						</button>
					) : null}
				</div>
			</div>

			{/* Agile Format (collapsed) */}
			{!isExpanded && (
				<div className="text-xs text-gray-600 mb-3 line-clamp-2">
					<span className="font-medium">En tant que</span> {story.asA},{" "}
					<span className="font-medium">je veux</span> {story.iWant}...
				</div>
			)}

			{/* Agile Format (expanded) */}
			{isExpanded && (
				<div className="text-sm text-gray-700 mb-3 space-y-1 bg-gray-50 p-3 rounded">
					<p>
						<span className="font-medium text-gray-900">En tant que</span>{" "}
						{story.asA}
					</p>
					<p>
						<span className="font-medium text-gray-900">Je veux</span>{" "}
						{story.iWant}
					</p>
					<p>
						<span className="font-medium text-gray-900">Afin de</span>{" "}
						{story.soThat}
					</p>
				</div>
			)}

			{/* Acceptance Criteria (if expanded and has criteria) */}
			{isExpanded && story.acceptanceCriteria.length > 0 && (
				<div className="mb-3">
					<p className="text-xs font-medium text-gray-700 mb-1">
						Critères d&#39;acceptation:
					</p>
					<ul className="text-xs text-gray-600 space-y-1">
						{story.acceptanceCriteria.map((criteria, idx) => (
							<li key={idx} className="flex items-start">
								<span className="text-green-500 mr-2">✓</span>
								<span>{criteria}</span>
							</li>
						))}
					</ul>
				</div>
			)}

			{/* Meta */}
			<div className="flex items-center justify-between text-xs text-gray-500">
				<div className="flex items-center gap-3">
					{story.assignee && (
						<div className="flex items-center gap-1">
							<div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-medium">
								{story.assignee.name?.charAt(0) ||
									story.assignee.email.charAt(0).toUpperCase()}
							</div>
							<span>{story.assignee.name || story.assignee.email}</span>
						</div>
					)}
					{story._count.tasks > 0 && (
						<span>📋 {story._count.tasks} tâches</span>
					)}
					{story.acceptanceCriteria.length > 0 && (
						<span>✓ {story.acceptanceCriteria.length} critères</span>
					)}
				</div>

				<div className="flex items-center gap-2">
					<button
						onClick={() => setIsExpanded(!isExpanded)}
						className="text-blue-600 hover:text-blue-800"
					>
						{isExpanded ? "Réduire" : "Détails"}
					</button>
					{onEdit && (
						<button
							onClick={() => onEdit(story)}
							className="text-gray-600 hover:text-gray-800"
						>
							Éditer
						</button>
					)}
					<button
						onClick={handleDelete}
						disabled={isDeleting}
						className="text-red-600 hover:text-red-800 disabled:opacity-50"
					>
						{isDeleting ? "..." : "Supprimer"}
					</button>
				</div>
			</div>

			{/* Story Point Picker Modal */}
			{showEstimation && (
				<StoryPointPicker
					storyId={story.id}
					currentPoints={story.storyPoints}
					onClose={() => setShowEstimation(false)}
				/>
			)}
		</div>
	);
}