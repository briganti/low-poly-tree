module.exports = {
  "env"     : {
    "browser": true
  },
  "extends" : "standard",
  "globals" : {
    "THREE": false
  },
    "rules"   : {
    "comma-dangle"                : ["error", "always-multiline"],
    "space-before-function-paren" : ["error", "never"],
    "sort-imports"                : ["error"],
  }
};