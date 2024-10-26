import eslintPluginPrettier from "eslint-plugin-prettier";

export default {
  files: ['**/*.js'],
  languageOptions: {
    sourceType: 'commonjs',
  },
  plugins: {
    prettier: eslintPluginPrettier
  }
};
