var path = require('path')
module.exports = {
    'extends': ['tslint-config-standard', 'tslint-react'],
    'rulesDirectory': [
      'rules'
    ],
    'linterOptions': {
      'typeCheck': true
    },
    'rules': {
      "totality-check": true,
      'quotemark': false,
      'jsdoc-format': false,
      'trailing-comma': false,
      'no-unbound-method': true,
      'promise-function-async': true,
      'variable-name': [true, 'ban-keywords', 'check-format', 'allow-leading-underscore'],
      'no-default-export': true,
      'prefer-const': true,
      'align': false,
      'ter-indent': false,
      'arrow-return-shorthand': [true, 'multiline'],
      'no-non-null-assertion': true,
      'no-null-keyword': true,
      'no-var-requires': true,
      'interface-name': false,
      'ban-types': [],
      'no-string-literal': true,
      'member-access': true,
      'jsx-no-string-ref': false,
      "no-unsafe-any": false,
      "no-unnecessary-type-assertion": false,
      'await-promise': true,
      'no-floating-promises': true,
      'no-for-in-array': true,
      'no-return-await': true,
      'semicolon': false,
      'ter-no-sparse-arrays': false,
      'space-before-function-paren': false,
      'ter-func-call-spacing': false,
      'whitespace': false,
      'object-literal-key-quotes': false,
      'jsx-no-multiline-js': false,
      'no-unused-variable': false,
    }
}
