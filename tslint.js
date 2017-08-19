var path = require('path')
module.exports = {
    'extends': ['tslint-config-standard', 'tslint-react'],
    'rulesDirectory': [
      path.dirname(require.resolve('tslint-strict-null-checks/rules/noUninitializedRule')),
      'rules'
    ],
    'linterOptions': {
      'typeCheck': true
    },
    'rules': {
      "totality-check": true,
      'no-uninitialized': [true, 'properties'],
      'quotemark': [true, 'single', 'jsx-double', 'avoid-escape'],
      'jsdoc-format': false,
      'trailing-comma': [
        true,
        {
          'multiline': {
            'objects': 'always',
            'arrays': 'always',
            'functions': 'always',
            'typeLiterals': 'never'
          },
          'singleline': 'never'
        }
      ],
      'no-unbound-method': true,
      'promise-function-async': true,
      'variable-name': [true, 'ban-keywords', 'check-format', 'allow-leading-underscore'],
      'no-default-export': true,
      'prefer-const': true,
      'align': [true, 'parameters', 'statements', 'arguments'],
      'arrow-return-shorthand': [true, 'multiline'],
      'no-non-null-assertion': true,
      'no-null-keyword': true,
      'no-var-requires': true,
      'interface-name': false,
      'ban-types': [],
      'no-string-literal': true,
      'space-before-function-paren': [true, {'anonymous': 'always', 'named': 'never', 'asyncArrow': 'always'}],
      'no-floating-promises': false,
      'member-access': true,
      'jsx-no-string-ref': false,
    }
}
