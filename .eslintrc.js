module.exports = {
	root: true,
	env: {
		browser: true,
		node: true
	},
	parserOptions: {
		parser: '@babel/eslint-parser',
		requireConfigFile: false
	},
	extends: [
		'@nuxtjs',
		'prettier',
		'plugin:nuxt/recommended',
	],
	plugins: [
	],
	// add your custom rules here
	rules: {
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-unused-vars': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'spaced-comment': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'import/order': 'error',
		"import/no-named-as-default": 0,
		'vue/array-bracket-spacing': 'error',
		'vue/arrow-spacing': 'error',
		'vue/block-spacing': 'error',
		'vue/brace-style': 'error',
		'vue/camelcase': 'error',
		'vue/comma-dangle': ['error', 'always-multiline'],
		'vue/component-name-in-template-casing': 'error',
		'vue/dot-location': ['error', 'property'],
		'vue/eqeqeq': 'error',
		'vue/key-spacing': 'error',
		'vue/keyword-spacing': 'error',
		'vue/no-boolean-default': ['error', 'default-false'],
		'vue/no-deprecated-scope-attribute': 'error',
		'vue/no-empty-pattern': 'error',
		'vue/object-curly-spacing': ['error', 'always'],
		'vue/padding-line-between-blocks': 'error',
		'vue/space-infix-ops': 'error',
		'vue/space-unary-ops': 'error',
		'vue/v-on-function-call': 'error',
		'vue/v-slot-style': [
			'error',
			{
				atComponent: 'v-slot',
				default: 'v-slot',
				named: 'longform',
			},
		],
		'vue/valid-v-slot': 'error',
		'vue/no-v-html': 'off',
		'vue/script-indent': [
			'error',
			'tab',
			{
				baseIndent: 1,
				switchCase: 1,
			},
		],
	}
}
