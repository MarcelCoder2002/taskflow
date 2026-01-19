"use client";

import { useDroppable } from "@dnd-kit/core";

type Story = {
	id: string;
	title: string;
	storyPoints: number | null;
};

export function KanbanColumn({
	                             id,
	                             title,
	                             count,
	                             children,
                             }: {
	id: string;
	title: string;
	count: number;
	children: React.ReactNode;
}) {
	const { setNodeRef, isOver } = useDroppable({
		id,
	});

	const bgColor = isOver ? "bg-blue-50 border-blue-300" : "bg-gray-50";

	return (
		<div className="flex flex-col h-full">
			<div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
				<h3 className="text-sm font-semibold text-gray-900">{title}</h3>
				<span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-xs font-medium">
          {count}
        </span>
			</div>

			<div
				ref={setNodeRef}
				className={`flex-1 px-4 py-3 space-y-3 overflow-y-auto min-h-[200px] border-2 border-dashed ${bgColor} transition-colors`}
			>
				{children}
			</div>
		</div>
	);
}