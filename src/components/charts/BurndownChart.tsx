"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

type BurndownData = {
	day: number;
	ideal: number;
	actual: number;
};

export function BurndownChart({
	                              data,
	                              totalPoints,
                              }: {
	data: BurndownData[];
	totalPoints: number;
}) {
	return (
		<div className="bg-white p-6 rounded-lg shadow">
			<h3 className="text-lg font-medium text-gray-900 mb-4">
				Burndown Chart
			</h3>

			<ResponsiveContainer width="100%" height={300}>
				<LineChart data={data}>
					<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
					<XAxis
						dataKey="day"
						label={{ value: "Jours du Sprint", position: "insideBottom", offset: -5 }}
						stroke="#6b7280"
					/>
					<YAxis
						label={{ value: "Story Points Restants", angle: -90, position: "insideLeft" }}
						domain={[0, totalPoints]}
						stroke="#6b7280"
					/>
					<Tooltip
						contentStyle={{
							backgroundColor: "#fff",
							border: "1px solid #e5e7eb",
							borderRadius: "0.375rem",
						}}
						formatter={(value: number, name: string) => {
							const label = name === "ideal" ? "Idéal" : "Réel";
							return [`${value} pts`, label];
						}}
						labelFormatter={(label) => `Jour ${label}`}
					/>
					<Legend
						formatter={(value) => (value === "ideal" ? "Courbe Idéale" : "Courbe Réelle")}
						wrapperStyle={{ paddingTop: "20px" }}
					/>
					<Line
						type="monotone"
						dataKey="ideal"
						stroke="#9ca3af"
						strokeWidth={2}
						strokeDasharray="5 5"
						dot={false}
						name="ideal"
					/>
					<Line
						type="monotone"
						dataKey="actual"
						stroke="#3b82f6"
						strokeWidth={3}
						dot={{ fill: "#3b82f6", r: 4 }}
						name="actual"
					/>
				</LineChart>
			</ResponsiveContainer>

			<div className="mt-4 grid grid-cols-2 gap-4 text-sm">
				<div className="flex items-center gap-2">
					<div className="w-4 h-0.5 bg-gray-400 border-t-2 border-dashed" />
					<span className="text-gray-600">Courbe Idéale (linéaire)</span>
				</div>
				<div className="flex items-center gap-2">
					<div className="w-4 h-0.5 bg-blue-500" />
					<span className="text-gray-600">Courbe Réelle (progression)</span>
				</div>
			</div>
		</div>
	);
}