"use client";

import { useState } from "react";
import { addStoryToSprint, removeStoryFromSprint } from "../../../../../../../app/actions/sprints";

type Story = {
	id: string;
	title: string;
	storyPoints: number | null;
	asA: string;
	iWant: string;
	soThat: string;
};

type Sprint = {
	id: string;
	stories: Story[];
};

export function SprintPlanningClient({
	                                     sprint,
	                                     backlogStories,
	                                     projectId,
                                     }: {
	sprint: Sprint;
	backlogStories: Story[];
	projectId: string;
}) {
	const [isAdding, setIsAdding] = useState<string | null>(null);
	const [isRemoving, setIsRemoving] = useState<string | null>(null);

	async function handleAddStory(storyId: string) {
		setIsAdding(storyId);
		try {
			await addStoryToSprint(storyId, sprint.id);
		} catch (error) {
			console.error(error);
			alert("Erreur lors de l'ajout");
		} finally {
			setIsAdding(null);
		}
	}

	async function handleRemoveStory(storyId: string) {
		setIsRemoving(storyId);
		try {
			await removeStoryFromSprint(storyId);
		} catch (error) {
			console.error(error);
			alert("Erreur lors du retrait");
		} finally {
			setIsRemoving(null);
		}
	}

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
			{/* Product Backlog */}
			<div className="bg-white shadow rounded-lg p-6">
				<h2 className="text-lg font-medium text-gray-900 mb-4">
					📋 Product Backlog ({backlogStories.length})
				</h2>

				{backlogStories.length === 0 ? (
					<div className="text-center py-8 text-gray-500">
						<p className="text-sm">
							Toutes les stories sont assignées à des sprints
						</p>
					</div>
				) : (
					<div className="space-y-3">
						{backlogStories.map((story) => (
							<div
								key={story.id}
								className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
							>
								<div className="flex items-start justify-between mb-2">
									<h3 className="text-sm font-medium text-gray-900 flex-1">
										{story.title}
									</h3>
									{story.storyPoints && (
										<span className="ml-2 inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
                      {story.storyPoints}
                    </span>
									)}
								</div>

								<p className="text-xs text-gray-600 mb-3">
									<span className="font-medium">En tant que</span> {story.asA},{" "}
									<span className="font-medium">je veux</span> {story.iWant}
								</p>

								<button
									onClick={() => handleAddStory(story.id)}
									disabled={isAdding === story.id}
									className="w-full text-xs px-3 py-1.5 border border-blue-300 rounded text-blue-700 hover:bg-blue-50 disabled:opacity-50"
								>
									{isAdding === story.id ? "Ajout..." : "➜ Ajouter au Sprint"}
								</button>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Sprint Backlog */}
			<div className="bg-white shadow rounded-lg p-6">
				<h2 className="text-lg font-medium text-gray-900 mb-4">
					⚡ Sprint Backlog ({sprint.stories.length})
				</h2>

				{sprint.stories.length === 0 ? (
					<div className="text-center py-8 text-gray-500">
						<svg
							className="mx-auto h-12 w-12 text-gray-400 mb-2"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M13 10V3L4 14h7v7l9-11h-7z"
							/>
						</svg>
						<p className="text-sm">Aucune story sélectionnée</p>
						<p className="text-xs mt-1">
							Ajoutez des stories depuis le Product Backlog
						</p>
					</div>
				) : (
					<div className="space-y-3">
						{sprint.stories.map((story) => (
							<div
								key={story.id}
								className="border-2 border-green-200 bg-green-50 rounded-lg p-4"
							>
								<div className="flex items-start justify-between mb-2">
									<h3 className="text-sm font-medium text-gray-900 flex-1">
										{story.title}
									</h3>
									{story.storyPoints && (
										<span className="ml-2 inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-600 text-white text-xs font-semibold">
                      {story.storyPoints}
                    </span>
									)}
								</div>

								<p className="text-xs text-gray-600 mb-3">
									<span className="font-medium">En tant que</span> {story.asA},{" "}
									<span className="font-medium">je veux</span> {story.iWant}
								</p>

								<button
									onClick={() => handleRemoveStory(story.id)}
									disabled={isRemoving === story.id}
									className="w-full text-xs px-3 py-1.5 border border-red-300 rounded text-red-700 hover:bg-red-50 disabled:opacity-50"
								>
									{isRemoving === story.id ? "Retrait..." : "✕ Retirer"}
								</button>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}