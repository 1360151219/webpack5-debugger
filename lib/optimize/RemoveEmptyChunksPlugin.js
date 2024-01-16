/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const { STAGE_BASIC, STAGE_ADVANCED } = require("../OptimizationStages");

/** @typedef {import("../Chunk")} Chunk */
/** @typedef {import("../Compiler")} Compiler */
class RemoveEmptyChunksPlugin {
	/**
	 * Apply the plugin
	 * @param {Compiler} compiler the compiler instance
	 * @returns {void}
	 */
	apply(compiler) {
		compiler.hooks.compilation.tap("RemoveEmptyChunksPlugin", compilation => {
			/**
			 * @param {Iterable<Chunk>} chunks the chunks array
			 * @returns {void}
			 */
			const handler = chunks => {
				const chunkGraph = compilation.chunkGraph;

				// 判断该chunk有否有modules
				// 1. 取ChunkGraph中对应chunk的 ChunkGraphChunk，判断其中的modules是否为0
				for (const chunk of chunks) {
					if (
						chunkGraph.getNumberOfChunkModules(chunk) === 0 &&
						!chunk.hasRuntime() &&
						chunkGraph.getNumberOfEntryModules(chunk) === 0
					) {
						compilation.chunkGraph.disconnectChunk(chunk);
						compilation.chunks.delete(chunk);
					}
				}
			};

			// TODO do it once
			compilation.hooks.optimizeChunks.tap(
				{
					name: "RemoveEmptyChunksPlugin",
					stage: STAGE_BASIC
				},
				handler
			);
			compilation.hooks.optimizeChunks.tap(
				{
					name: "RemoveEmptyChunksPlugin",
					stage: STAGE_ADVANCED
				},
				handler
			);
		});
	}
}
module.exports = RemoveEmptyChunksPlugin;
