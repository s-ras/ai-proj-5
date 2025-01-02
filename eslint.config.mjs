import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

export default [
	{
		ignores: ["**/build", "**/.eslintrc.cjs"],
	},
	...fixupConfigRules(
		compat.extends(
			"eslint:recommended",
			"plugin:@typescript-eslint/recommended",
			"plugin:react-hooks/recommended",
			"eslint-config-prettier",
		),
	).map((config) => ({
		...config,
		files: ["**/*.{ts,tsx}"],
	})),
	{
		files: ["**/*.{ts,tsx}"],

		plugins: {
			"@typescript-eslint": fixupPluginRules(typescriptEslint),
			"react-hooks": fixupPluginRules(reactHooks),
		},

		languageOptions: {
			globals: {
				...globals.browser,
			},
		},

		rules: {
			"prefer-const": "error",
			"@typescript-eslint/no-unused-vars": "warn",
			"@typescript-eslint/no-unused-expressions": "warn",
			"react/jsx-uses-react": "off",
			"react/react-in-jsx-scope": "off",
			"react/prop-types": "off",
		},
	},
];
