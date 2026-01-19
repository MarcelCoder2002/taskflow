"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { UserStoryCard } from "./UserStoryCard";

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

export function SortableStoryCard({
	                                  story,
	                                  index,
                                  }: {
	story: UserStory;
	index: number;
}) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: story.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<div ref={setNodeRef} style={style} className="relative">
			{/* Priority Badge */}
			<div className="absolute -left-8 top-4 flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
				{index + 1}
			</div>

			{/* Drag Handle */}
			<div
				{...attributes}
				{...listeners}
				className="absolute -left-2 top-0 bottom-0 w-8 flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-gray-100 rounded-l"
			>
				<svg
					className="w-4 h-4 text-gray-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M4 8h16M4 16h16"
					/>
				</svg>
			</div>

			{/* Story Card */}
			<div className={isDragging ? "shadow-xl" : ""}>
				<UserStoryCard story={story} />
			</div>
		</div>
	);
}