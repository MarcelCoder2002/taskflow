"use client";

import { useState } from "react";
import {
	DndContext,
	DragEndEvent,
	DragOverlay,
	DragStartEvent,
	closestCorners,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { KanbanColumn } from "../../../../../../../components/board/KanbanColumn";
import { StoryCard } from "../../../../../../../components/board/StoryCard";
import { StoryDetailsModal } from "../../../../../../../components/board/StoryDetailsModal";
import { updateStoryStatus } from "../../../../../../../app/actions/board";

type Story = {
	id: string;
	title: string;
	asA: string;
	iWant: string;
	soThat: string;
	storyPoints: number | null;
	status: string;
	acceptanceCriteria: string[];
	tasks: Task[];
	assignee: {
		name: string | null;
		email: string;
	} | null;
};

type Task = {
	id: string;
	title: string;
	status: string;
	estimatedHours: number | null;
};

export function KanbanBoardClient({
	                                  sprint,
	                                  initialTodoStories,
	                                  initialInProgressStories,
	                                  initialDoneStories,
                                  }: {
	sprint: any;
	initialTodoStories: Story[];
	initialInProgressStories: Story[];
	initialDoneStories: Story[];
}) {
	const [todoStories, setTodoStories] = useState(initialTodoStories);
	const [inProgressStories, setInProgressStories] = useState(initialInProgressStories);
	const [doneStories, setDoneStories] = useState(initialDoneStories);
	const [activeStory, setActiveStory] = useState<Story | null>(null);
	const [selectedStory, setSelectedStory] = useState<Story | null>(null);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		})
	);

	function handleDragStart(event: DragStartEvent) {
		const story = event.active.data.current?.story as Story;
		setActiveStory(story);
	}

	async function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		setActiveStory(null);

		if (!over) return;

		const storyId = active.id as string;
		const newColumn = over.id as string;

		// Find the story
		let story: Story | undefined;
		let sourceColumn: string = "";

		if (todoStories.find((s) => s.id === storyId)) {
			story = todoStories.find((s) => s.id === storyId);
			sourceColumn = "TODO";
		} else if (inProgressStories.find((s) => s.id === storyId)) {
			story = inProgressStories.find((s) => s.id === storyId);
			sourceColumn = "IN_PROGRESS";
		} else if (doneStories.find((s) => s.id === storyId)) {
			story = doneStories.find((s) => s.id === storyId);
			sourceColumn = "DONE";
		}

		if (!story || sourceColumn === newColumn) return;

		// Check if moving to DONE - require all tasks to be completed
		if (newColumn === "DONE") {
			const allTasksDone = story.tasks.length === 0 || story.tasks.every((t) => t.status === "DONE");
			if (!allTasksDone) {
				alert("Toutes les tâches doivent être terminées avant de marquer la story comme DONE");
				return;
			}

			const confirmed = confirm(
				`Marquer "${story.title}" comme terminée ?\n\nCette action confirme que tous les critères d'acceptation sont remplis.`
			);
			if (!confirmed) return;
		}

		// Optimistic update
		setTodoStories((prev) => prev.filter((s) => s.id !== storyId));
		setInProgressStories((prev) => prev.filter((s) => s.id !== storyId));
		setDoneStories((prev) => prev.filter((s) => s.id !== storyId));

		const updatedStory = { ...story, status: newColumn };

		if (newColumn === "TODO") {
			setTodoStories((prev) => [...prev, updatedStory]);
		} else if (newColumn === "IN_PROGRESS") {
			setInProgressStories((prev) => [...prev, updatedStory]);
		} else if (newColumn === "DONE") {
			setDoneStories((prev) => [...prev, updatedStory]);
		}

		// Update server
		try {
			await updateStoryStatus(storyId, newColumn as any);
		} catch (error) {
			console.error("Error updating story status:", error);
			alert("Erreur lors de la mise à jour");
			// Revert on error
			window.location.reload();
		}
	}

	return (
		<>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCorners}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
			>
				<div className="h-full grid grid-cols-3 gap-4 p-6">
					<KanbanColumn id="TODO" title="📋 À Faire" count={todoStories.length}>
						{todoStories.map((story) => (
							<StoryCard
								key={story.id}
								story={story}
								onOpenDetails={setSelectedStory}
							/>
						))}
					</KanbanColumn>

					<KanbanColumn
						id="IN_PROGRESS"
						title="🚧 En Cours"
						count={inProgressStories.length}
					>
						{inProgressStories.map((story) => (
							<StoryCard
								key={story.id}
								story={story}
								onOpenDetails={setSelectedStory}
							/>
						))}
					</KanbanColumn>

					<KanbanColumn id="DONE" title="✅ Terminé" count={doneStories.length}>
						{doneStories.map((story) => (
							<StoryCard
								key={story.id}
								story={story}
								onOpenDetails={setSelectedStory}
							/>
						))}
					</KanbanColumn>
				</div>

				<DragOverlay>
					{activeStory ? (
						<div className="bg-white border-2 border-blue-500 rounded-lg p-3 shadow-lg rotate-3">
							<h4 className="text-sm font-medium text-gray-900">
								{activeStory.title}
							</h4>
						</div>
					) : null}
				</DragOverlay>
			</DndContext>

			{selectedStory && (
				<StoryDetailsModal
					story={selectedStory}
					onClose={() => setSelectedStory(null)}
				/>
			)}
		</>
	);
}