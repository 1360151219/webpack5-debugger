import React from "react";
import { useStore } from "../context";
import { formatFileSize } from "../utils";
import { Collapsible, Tag, Typography } from "@douyinfe/semi-ui";
import { TagColor } from "@douyinfe/semi-ui/lib/es/tag";

// background: rgba(var(--semi-light-blue-1), 0.3);
//     padding: 4px 6px;
//     border-radius: 6px;

const ColorMap = [
	{
		bg: "rgba(var(--semi-light-blue-1), 0.3)",
		color: "var(--semi-color-secondary)",
		tagColor: "light-blue" as TagColor
	}
];

export const Summary = () => {
	const {
		state: { data }
	} = useStore();

	console.log("===data", data);
	const { chunks, entrypoints } = data;
	const asyncChunkLength = chunks.filter(chunk => !chunk.initial).length;

	const entrypointsCount = Object.keys(entrypoints).length;
	return (
		<div className="p-6">
			<div className="bg-white rounded-lg shadow p-6">
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-lg font-semibold text-gray-700">Build Summary</h3>
					<i className="fas fa-info-circle text-blue-400"></i>
				</div>
				<div className="space-y-4">
					<div>
						<div className="flex justify-between text-sm text-gray-600 mb-1">
							<span>Total Chunks</span>
							<span id="totalChunks">{chunks.length}</span>
						</div>
					</div>
					<div>
						<div className="flex justify-between text-sm text-gray-600 mb-1">
							<span>Total Size</span>
							<span id="totalSize">
								{formatFileSize(
									chunks.reduce((sizes, chunk) => sizes + chunk.size, 0)
								)}
							</span>
						</div>
					</div>
					<div>
						<div className="flex justify-between text-sm text-gray-600 mb-1">
							<span>Entry Points</span>
							<div className="flex items-center">
								<span id="entryChunks">{entrypointsCount}</span>
								<i className="fas fa-chevron-down ml-1 text-xs transition-transform duration-300"></i>
							</div>
						</div>
						<div>
							{Object.values(entrypoints).map((entrypoint: any, index) => {
								const Color = ColorMap[index];
								return (
									<div
										key={index}
										className="flex justify-between text-sm text-gray-400 mt-2 px-3 gap-4"
										style={{
											background: Color.bg,
											borderRadius: 6,
											padding: "4px 6px"
										}}
									>
										<Typography.Text style={{ color: Color.color }}>
											{entrypoint.name}
										</Typography.Text>
										<div className="flex items-center gap-2">
											{entrypoint.chunks.map((chunk: any) => (
												<Tag
													type="ghost"
													size="small"
													key={chunk.id}
													color={Color.tagColor}
												>
													<span>{chunk}</span>
												</Tag>
											))}
										</div>
									</div>
								);
							})}
						</div>
					</div>
					<div>
						<div className="flex justify-between text-sm text-gray-600 mb-1">
							<span>Async Chunks</span>
							<span id="asyncChunks">{asyncChunkLength}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
