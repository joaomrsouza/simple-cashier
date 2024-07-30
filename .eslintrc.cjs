/** @type {import("eslint").Linter.Config} */
const config = {
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  plugins: ["@typescript-eslint", "perfectionist"],
  rules: {
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        fixStyle: "inline-type-imports",
        prefer: "type-imports",
      },
    ],
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        checksVoidReturn: {
          attributes: false,
        },
      },
    ],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/require-await": "off",

    "perfectionist/sort-array-includes": [
      "warn",
      {
        order: "asc",
        groupKind: "literals-first",
        type: "alphabetical",
      },
    ],
    "perfectionist/sort-exports": [
      "warn",
      {
        order: "asc",
        type: "alphabetical",
      },
    ],
    "perfectionist/sort-interfaces": [
      "warn",
      {
        groups: ["unknown", "multiline"],
        order: "asc",
        partitionByNewLine: true,
        type: "alphabetical",
      },
    ],
    "perfectionist/sort-intersection-types": [
      "warn",
      {
        order: "asc",
        type: "line-length",
      },
    ],
    "perfectionist/sort-jsx-props": [
      "warn",
      {
        groups: ["shorthand", "unknown", "multiline"],
        order: "asc",
        type: "line-length",
      },
    ],
    "perfectionist/sort-named-exports": [
      "warn",
      {
        groupKind: "mixed",
        order: "asc",
        type: "alphabetical",
      },
    ],
    "perfectionist/sort-object-types": [
      "warn",
      {
        groups: ["unknown", "multiline"],
        order: "asc",
        partitionByNewLine: true,
        type: "alphabetical",
      },
    ],
    "perfectionist/sort-objects": [
      "warn",
      {
        order: "asc",
        partitionByNewLine: true,
        type: "alphabetical",
      },
    ],
    "perfectionist/sort-union-types": [
      "warn",
      {
        order: "asc",
        type: "alphabetical",
        groups: ["unknown", "nullish"],
      },
    ],

    "react/jsx-handler-names": [
      "warn",
      {
        checkInlineFunction: false,
        checkLocalVariables: true,
        eventHandlerPrefix: "handle",
        eventHandlerPropPrefix: "on",
      },
    ],
    "react/jsx-key": ["error", { checkFragmentShorthand: true }],
    "react/jsx-no-useless-fragment": "warn",
  },
};
module.exports = config;
