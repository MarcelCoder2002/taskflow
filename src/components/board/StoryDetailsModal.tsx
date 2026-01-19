"use client";

import { useState } from "react";
import { createTask, updateTaskStatus, deleteTask } from "../../app/actions/board";

type Story = {
	id: string;
	title: string;
	asA: string;
	iWant: string;
	soThat: string;
	storyPoints: number | null;
	acceptanceCriteria: string[];
	tasks: Task[];
};

type Task = {
	id: string;
	title: string;
	status: string;
	estimatedHours: number | null;
};

export function StoryDetailsModal({
	                                  story,
	                                  onClose,
                                  }: {
	story: Story;
	onClose: () => void;
}) {
	const [newTaskTitle, setNewTaskTitle] = useState("");
	const [isAddingTask, setIsAddingTask] = useState(false);

	async function handleAddTask(e: React.FormEvent) {
		e.preventDefault();
		if (!newTaskTitle.trim()) return;

		setIsAddingTask(true);
		try {
			await createTask({
				title: newTaskTitle,
				storyId: story.id,
			});
			setNewTaskTitle("");
		} catch (error) {
			console.error(error);
			alert("Erreur lors de l'ajout de la tâche");
		} finally {
			setIsAddingTask(false);
		}
	}

	async function handleToggleTask(taskId: string, currentStatus: string) {
		const newStatus = currentStatus === "DONE" ? "TODO" : "DONE";
		try {
			await updateTaskStatus(taskId, newStatus);
		} catch (error) {
			console.error(error);
		}
	}

	async function handleDeleteTask(taskId: string) {
		if (!confirm("Supprimer cette tâche ?")) return;

		try {
			await deleteTask(taskId);
		} catch (error) {
			console.error(error);
			alert("Erreur lors de la suppression");
		}
	}

	const allTasksDone = story.tasks.length > 0 && story.tasks.every((t) => t.status === "DONE");

	return (
		<div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
				<div className="p-6">
					{/* Header */}
					<div className="flex items-start justify-between mb-6">
						<div className="flex-1">
							<h2 className="text-2xl font-bold text-gray-900">{story.title}</h2>
							{story.storyPoints && (
								<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                  {story.storyPoints} story points
                </span>
							)}
						</div>
						<button
							onClick={onClose}
							className="text-gray-400 hover:text-gray-600"
						>
							<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>

					{/* Agile Format */}
					<div className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-4">
						<h3 className="text-sm font-medium text-blue-900 mb-2">User Story</h3>
						<div className="text-sm text-blue-800 space-y-1">
							<p><strong>En tant que</strong> {story.asA}</p>
							<p><strong>Je veux</strong> {story.iWant}</p>
							<p><strong>Afin de</strong> {story.soThat}</p>
						</div>
					</div>

					{/* Acceptance Criteria */}
					{story.acceptanceCriteria.length > 0 && (
						<div className="mb-6">
							<h3 className="text-sm font-medium text-gray-900 mb-2">
								Critères d&#39;acceptation
							</h3>
							<ul className="space-y-1">
								{story.acceptanceCriteria.map((criteria, idx) => (
									<li key={idx} className="flex items-start text-sm text-gray-600">
										<span className="text-green-500 mr-2">✓</span>
										<span>{criteria}</span>
									</li>
								))}
							</ul>
						</div>
					)}

					{/* Tasks */}
					<div className="mb-6">
						<div className="flex items-center justify-between mb-3">
							<h3 className="text-sm font-medium text-gray-900">
								Tâches Techniques ({story.tasks.length})
							</h3>
							{allTasksDone && story.tasks.length > 0 && (
								<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✓ Prêt à livrer
                </span>
							)}
						</div>

						<div className="space-y-2 mb-3">
							{story.tasks.map((task) => (
								<div
									key={task.id}
									className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg"
								>
									<input
										type="checkbox"
										checked={task.status === "DONE"}
										onChange={() => handleToggleTask(task.id, task.status)}
										className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
									/>
									<span
										className={`flex-1 text-sm ${
											task.status === "DONE"
												? "line-through text-gray-500"
												: "text-gray-900"
										}`}
									>
                    {task.title}
                  </span>
									<button
										onClick={() => handleDeleteTask(task.id)}
										className="text-red-600 hover:text-red-800 text-xs"
									>
										Supprimer
									</button>
								</div>
							))}
						</div>

						{/* Add Task Form */}
						<form onSubmit={handleAddTask} className="flex gap-2">
							<input
								type="text"
								value={newTaskTitle}
								onChange={(e) => setNewTaskTitle(e.target.value)}
								placeholder="Nouvelle tâche technique..."
								className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
							<button
								type="submit"
								disabled={isAddingTask || !newTaskTitle.trim()}
								className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
							>
								{isAddingTask ? "..." : "Ajouter"}
							</button>
						</form>
					</div>

					{/* Close Button */}
					<div className="flex justify-end">
						<button
							onClick={onClose}
							className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
						>
							Fermer
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}