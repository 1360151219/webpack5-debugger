const { Dependency, Template } = require("webpack");

class TestDepandency extends Dependency {
	constructor() {
		super();
	}
}

TestDepandency.Template = class TestDepandencyTemplate extends Template {
	/**
	 * @param {Dependency} dependency the dependency for which the template should be applied
	 * @param {ReplaceSource} source the current replace source which can be modified
	 * @param {DependencyTemplateContext} templateContext the context object
	 * @returns {void}
	 */
	apply(dependency, source, templateContext) {
		source.insert(0, "// hello world \n\r");
	}
};

module.exports = class DemoPlugin {
	apply(compiler) {
		compiler.hooks.thisCompilation.tap("TestDepandencyPlugin", compilation => {
			// 调用 dependencyTemplates ，注册 Dependency 到 Template 的映射
			compilation.dependencyTemplates.set(
				TestDepandency,
				new TestDepandency.Template()
			);
			compilation.hooks.succeedModule.tap("TestDepandencyPlugin", module => {
				// 模块构建完毕后，插入 DemoDependency 对象
				module.addDependency(new TestDepandency());
			});
		});
	}
};
