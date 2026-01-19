"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

type Story = {
	id: string;
	title: string;
	storyPoints: number | null;
	status: string;
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
};

export function StoryCard({
	                          story,
	                          onOpenDetails,
                          }: {
	story: Story;
	onOpenDetails: (story: Story) => void;
}) {
	const { attributes, listeners, setNodeRef, transform, isDragging } =
		useDraggable({
			id: story.id,
			data: { story },
		});

	const style = {
		transform: CSS.Translate.toString(transform),
		opacity: isDragging ? 0.5 : 1,
	};

	const completedTasks = story.tasks.filter((t) => t.status === "DONE").length;
	const totalTasks = story.tasks.length;
	const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			onClick={() => onOpenDetails(story)}
			className="bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow"
		>
			{/* Header */}
			<div className="flex items-start justify-between mb-2">
				<h4 className="text-sm font-medium text-gray-900 flex-1 line-clamp-2">
					{story.title}
				</h4>
				{story.storyPoints && (
					<span className="ml-2 flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
            {story.storyPoints}
          </span>
				)}
			</div>

			{/* Tasks Progress */}
			{totalTasks > 0 && (
				<div className="mb-2">
					<div className="flex items-center justify-between text-xs text-gray-500 mb-1">
						<span>Tâches</span>
						<span>
              {completedTasks}/{totalTasks}
            </span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-1.5">
						<div
							className="bg-green-600 h-1.5 rounded-full transition-all"
							style={{ width: `${progress}%` }}
						/>
					</div>
				</div>
			)}

			{/* Assignee */}
			{story.assignee && (
				<div className="flex items-center text-xs text-gray-500">
					<div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-medium mr-1">
						{story.assignee.name?.charAt(0) ||
							story.assignee.email.charAt(0).toUpperCase()}
					</div>
					<span className="truncate">
            {story.assignee.name || story.assignee.email}
          </span>
				</div>
			)}
		</div>
	);
}