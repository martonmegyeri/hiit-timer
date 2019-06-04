module.exports = {
	"extends": "airbnb",
	"env": {
		"browser": true,
		"es6": true,
		"node": true,
		"jest": true
	},
	"parser": "babel-eslint",
	"parserOptions": {
		"ecmaFeatures": {
			"legacyDecorators": true
		}
	},
	"rules": {
		"arrow-parens": 0,
		"linebreak-style": 0,
		"no-plusplus": 0,
		"no-alert": 0,
		"function-paren-newline": 0,
		"no-confusing-arrow": 0,
    "implicit-arrow-linebreak": 0,
    "no-use-before-define": 0,
		"react/prop-types": 0,
		"react/no-array-index-key": 0,
		"object-curly-newline": 0,
		"no-else-return": 0,
		"consistent-return": 0,
		"max-len": 0,
		"no-case-declarations": 0,
		"array-bracket-spacing": 0,
		"import/no-mutable-exports": 0,
		"import/prefer-default-export": 0,
		"lines-between-class-members": 0,
		"arrow-body-style": 0,
		"react/destructuring-assignment": 0,
		"react/jsx-one-expression-per-line": 0,
		"react/forbid-prop-types": 0,
		"react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
		"comma-dangle": ["error", {
			"arrays": "never",
			"objects": "never",
			"imports": "never",
			"exports": "never",
			"functions": "ignore"
		}]
	}
};
