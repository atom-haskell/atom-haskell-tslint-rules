module.exports = {
    'extends': ['tslint-config-standard', 'tslint-react'],
    'rulesDirectory': [
      '../tslint-strict-null-checks/rules'
    ],
    'linterOptions': {
      'typeCheck': true
    },
    'rules': {
      'no-uninitialized': [true, "variables", "properties"],
      'quotemark': [true, 'single', 'jsx-double', 'avoid-escape'],
      'jsdoc-format': false,
      'trailing-comma': [
        true,
        {
          'multiline': 'always',
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
      'space-before-function-paren': false,
      'no-floating-promises': false,
      'member-access': true
    }
}
