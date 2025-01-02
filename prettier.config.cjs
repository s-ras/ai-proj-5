/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */

const config = {
	useTabs: true,
	tabWidth: 4,
	overrides: [
		{
			files: "*.ts",
			options: {
				trailingComma: "es5",
				bracketSpacing: true,
				semi: true,
				quoteProps: "consistent",
				arrowParens: "avoid",
				parser: "typescript",
			},
		},
	],
};

module.exports = config;
