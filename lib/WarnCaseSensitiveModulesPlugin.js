/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const CaseSensitiveModulesWarning = require("./CaseSensitiveModulesWarning");

/** @typedef {import("./Compiler")} Compiler */
/** @typedef {import("./Module")} Module */
/** @typedef {import("./NormalModule")} NormalModule */

class WarnCaseSensitiveModulesPlugin {
	/**
	 * Apply the plugin
	 * @param {Compiler} compiler the compiler instance
	 * @returns {void}
	 */
	apply(compiler) {
		compiler.hooks.compilation.tap(
			"WarnCaseSensitiveModulesPlugin",
			compilation => {
				compilation.hooks.seal.tap("WarnCaseSensitiveModulesPlugin", () => {
					/** @type {Map<string, Map<string, Module>>} */
					const moduleWithoutCase = new Map();
					for (const module of compilation.modules) {
						const identifier = module.identifier();

						// Ignore `data:` URLs, because it's not a real path
						if (
							/** @type {NormalModule} */
							(module).resourceResolveData !== undefined &&
							/** @type {NormalModule} */
							(module).resourceResolveData.encodedContent !== undefined
						) {
							continue;
						}

						const lowerIdentifier = identifier.toLowerCase();
						// moduleWithoutCase: Map<lowerIdentifier, map>
						// map :Map<id, module>
						let map = moduleWithoutCase.get(lowerIdentifier);
						if (map === undefined) {
							map = new Map();
							moduleWithoutCase.set(lowerIdentifier, map);
						}
						map.set(identifier, module);
					}
					// 去检查identifier中的map是否存在大于1的module，如果是则表示存在不同大小写的文件路径，则报错
					for (const pair of moduleWithoutCase) {
						const map = pair[1];
						if (map.size > 1) {
							compilation.warnings.push(
								new CaseSensitiveModulesWarning(
									map.values(),
									compilation.moduleGraph
								)
							);
						}
					}
				});
			}
		);
	}
}

module.exports = WarnCaseSensitiveModulesPlugin;
