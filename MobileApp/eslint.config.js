const reactPlugin = require('eslint-plugin-react');
const reactNativePlugin = require('eslint-plugin-react-native');
const prettierPlugin = require('eslint-plugin-prettier');
const recommendedReact = require('eslint-plugin-react/configs/recommended');
const babelParser = require('@babel/eslint-parser');


module.exports = [
    {
        files: ['**/*.{js,jsx}'],
        languageOptions: {
            parser: babelParser,
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                browser: true,
                node: true,
                es2021: true,
            },
        },
        plugins: {
            react: reactPlugin,
            'react-native': reactNativePlugin,
            prettier: prettierPlugin,
        },
        rules: {
            ...recommendedReact.rules,
            'react/react-in-jsx-scope': 'off',
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
];
