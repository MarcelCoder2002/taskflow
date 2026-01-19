"use client";

import { useState } from "react";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableStoryCard } from "./SortableStoryCard";
import { updateStoriesPriorities } from "../../app/actions/user-stories";

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

export function SortableBacklog({
	                                projectId,
	                                initialStories,
                                }: {
	projectId: string;
	initialStories: UserStory[];
}) {
	const [stories, setStories] = useState(initialStories);
	const [isSaving, setIsSaving] = useState(false);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8, // Require 8px movement before drag starts
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	async function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;

		if (!over || active.id === over.id) {
			return;
		}

		const oldIndex = stories.findIndex((s) => s.id === active.id);
		const newIndex = stories.findIndex((s) => s.id === over.id);

		const newStories = arrayMove(stories, oldIndex, newIndex);
		setStories(newStories);

		// Save to server
		setIsSaving(true);
		try {
			await updateStoriesPriorities(
				projectId,
				newStories.map((s) => s.id)
			);
		} catch (error) {
			console.error("Error updating priorities:", error);
			// Revert on error
			setStories(stories);
			alert("Erreur lors de la mise à jour des priorités");
		} finally {
			setIsSaving(false);
		}
	}

	return (
		<div className="relative">
			{isSaving && (
				<div className="absolute top-0 right-0 bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
					Sauvegarde...
				</div>
			)}

			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
			>
				<SortableContext
					items={stories.map((s) => s.id)}
					strategy={verticalListSortingStrategy}
				>
					<div className="space-y-3">
						{stories.map((story, index) => (
							<SortableStoryCard
								key={story.id}
								story={story}
								index={index}
							/>
						))}
					</div>
				</SortableContext>
			</DndContext>

			<div className="mt-4 text-xs text-gray-500 bg-blue-50 border border-blue-200 rounded p-3">
				💡 <strong>Astuce:</strong> Glissez-déposez les stories pour les
				réorganiser. Les stories en haut sont les plus prioritaires et seront
				développées en premier.
			</div>
		</div>
	);
}