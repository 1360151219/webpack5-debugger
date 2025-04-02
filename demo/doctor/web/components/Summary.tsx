import React from "react";
import { useStore } from "../context";
import { formatFileSize } from "../utils";
import { Collapsible, Tag, Typography } from "@douyinfe/semi-ui";
import { set } from "core-js/core/dict";

export const Summary = () => {
	const {
		state: { data }
	} = useStore();

	const [entrypointsOpen, setEntrypointsOpen] = React.useState(false);
	console.log("===data", data);
	const { chunks, entrypoints } = data;

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
						<div
							className="flex justify-between text-sm text-gray-600 mb-1 cursor-pointer"
							onClick={() => {
								setEntrypointsOpen(open => !open);
							}}
						>
							<span>Entry Points</span>
							<div className="flex items-center">
								<span id="entryChunks">{entrypointsCount}</span>
								<i
									className="fas fa-chevron-down ml-1 text-xs transition-transform duration-300"
									style={{
										transform: entrypointsOpen ? "translateY(180deg)" : ""
									}}
								></i>
							</div>
						</div>
						<Collapsible isOpen={entrypointsOpen}>
							{Object.values(entrypoints).map((entrypoint: any, index) => (
								<div
									key={index}
									className="flex justify-between text-sm text-gray-400 mt-2 px-3 gap-4"
								>
									<Typography.Text
										style={{ color: "var(--semi-color-secondary)" }}
									>
										{entrypoint.name}
									</Typography.Text>
									<div className="flex items-center gap-2">
										{entrypoint.chunks.map((chunk: any) => (
											<Tag
												type="ghost"
												size="small"
												key={chunk.id}
												color="light-blue"
											>
												<span>{chunk}</span>
												{/* <span>{formatFileSize(chunk.size)}</span> */}
											</Tag>
										))}
									</div>
								</div>
							))}
						</Collapsible>
					</div>
					<div>
						<div className="flex justify-between text-sm text-gray-600 mb-1">
							<span>Async Chunks</span>
							<span id="asyncChunks">0</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
