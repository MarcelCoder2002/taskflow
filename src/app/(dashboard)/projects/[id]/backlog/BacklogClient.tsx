"use client";

import {useState} from "react";
import {CreateUserStoryModal} from "../../../../../components/backlog/CreateUserStoryModal";
import {SortableBacklog} from "../../../../../components/backlog/SortableBacklog";

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

export function BacklogClient({
	                              projectId,
	                              initialStories,
                              }: {
	projectId: string;
	initialStories: UserStory[];
}) {
	const [showCreateModal, setShowCreateModal] = useState(false);

	return (
		<>
			<div className="bg-white shadow rounded-lg">
				<div className="p-6">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-lg font-medium text-gray-900">
							User Stories (ordre de priorité)
						</h2>
						<button
							onClick={() => setShowCreateModal(true)}
							className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
						>
							+ Nouvelle Story
						</button>
					</div>

					{initialStories.length === 0 ? (
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
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
							<h3 className="mt-2 text-sm font-medium text-gray-900">
								Aucune user story
							</h3>
							<p className="mt-1 text-sm text-gray-500">
								Commencez par créer votre première user story au format agile
							</p>
							<div className="mt-6">
								<button
									onClick={() => setShowCreateModal(true)}
									className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
								>
									+ Créer une Story
								</button>
							</div>
						</div>
					) : (
						<div className="pl-10">
							<SortableBacklog
								projectId={projectId}
								initialStories={initialStories}
							/>
						</div>
					)}
				</div>
			</div>

			{showCreateModal && (
				<CreateUserStoryModal
					projectId={projectId}
					onClose={() => setShowCreateModal(false)}
				/>
			)}
		</>
	);
}