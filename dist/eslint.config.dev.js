"use strict";

module.exports = [{
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true
      }
    }
  },
  rules: {
    indent: ["error", 2],
    quotes: ["error", "single"],
    semi: ["error", "always"],
    "linebreak-style": ["error", "unix"],
    "max-len": ["error", {
      code: 86
    }],
    // specific cause of length of dividers
    "comma-dangle": ["error", "always-multiline"],
    "space-before-function-paren": ["error", "always"],
    "prefer-const": "error"
  }
}];