import globals from "globals";
import pluginJs from "@eslint/js";
import pluginVue from "eslint-plugin-vue";

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Configuración general para todos los archivos JS, MJS, CJS y Vue
  {
    files: ["**/*.{js,mjs,cjs,vue}"],
    languageOptions: {
      globals: {
        ...globals.browser, // Variables globales del navegador
        ...globals.node,    // Variables globales de Node.js
      },
    },
  },
  {
    rules: {
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }]
    },
  },
  // Configuración específica para archivos JavaScript
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs", // Para soportar CommonJS
    },
  },
  // Configuración de las reglas recomendadas de JavaScript
  pluginJs.configs.recommended,
  // Configuración básica para Vue.js
  ...pluginVue.configs["flat/essential"],
];
