import * as utils from 'tsutils'
import * as ts from 'typescript'
import * as Lint from 'tslint'

export class Rule extends Lint.Rules.TypedRule {
  public static metadata: Lint.IRuleMetadata = {
    ruleName: 'totality-check',
    description: 'Checks if if/switch exhausts type union',
    optionsDescription: 'Not configurable.',
    options: null, // tslint:disable-line: no-null-keyword
    optionExamples: [true],
    type: 'functionality',
    typescriptOnly: true,
    requiresTypeInfo: true,
  }

  public static FAILURE_STRING = 'Switch statement should include a "default" case'

  public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
    return this.applyWithFunction(sourceFile, (ctx: Lint.WalkContext<void>) => walk(ctx, program.getTypeChecker()))
  }
}

function walk(ctx: Lint.WalkContext<void>, tc: ts.TypeChecker) {
  function getClauseVal(expr: ts.Expression) {
    const type = tc.getTypeAtLocation(expr)
    if (type.flags & ts.TypeFlags.Literal) {
      const lt = type as ts.LiteralType
      return lt.value
    }
  }
  function getUnionTypes(e: ts.Expression) {
    const type = tc.getTypeAtLocation(e)
    if (type.flags & ts.TypeFlags.Union) {
      const types = (type as ts.UnionType).types
      if (types.every(({ flags }) => 0 !== (flags & ts.TypeFlags.Literal))) {
        return (types as ts.LiteralType[]).map(({ value }) => value)
      }
    }
  }
  function check(node: ts.IfStatement, sourceFile: ts.SourceFile) {
    let switchVariable: ts.Expression | undefined
    const cases = everyCase(node, (expr) => {
      if (switchVariable !== undefined) {
        return nodeEquals(expr, switchVariable, sourceFile)
      } else {
        switchVariable = expr
        return true
      }
    })
    return { cases, switchVariable }
  }
  function everyCase({ expression, elseStatement }: ts.IfStatement, test: (e: ts.Expression) => boolean): Array<string | number> | undefined {
    if (elseStatement && !utils.isIfStatement(elseStatement)) {
      return undefined
    }
    const ec = everyCondition(expression, test)
    if (!ec) {
      return undefined
    }
    if (!elseStatement) {
      return ec
    }
    const ec2 = everyCase(elseStatement, test)
    if (!ec2) {
      return undefined
    }
    return ec.concat(ec2)
  }
  function everyCondition(node: ts.Expression, test: (e: ts.Expression) => boolean): Array<string | number> | undefined {
    if (!utils.isBinaryExpression(node)) {
      return undefined
    }
    const { operatorToken, left, right } = node
    switch (operatorToken.kind) {
      case ts.SyntaxKind.BarBarToken: {
        const l = everyCondition(left, test)
        if (!l) return undefined
        const r = everyCondition(right, test)
        if (!r) return undefined
        return l.concat(r)
      }
      case ts.SyntaxKind.EqualsEqualsEqualsToken: {
        if (!isSimple(left) || !isSimple(right) || !test(left)) {
          return undefined
        }
        const val = getClauseVal(right)
        if (val === undefined) return undefined
        return [val]
      }
      default:
        return undefined
    }
  }
  return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
    if (utils.isSwitchStatement(node)
      && !(node as ts.SwitchStatement).caseBlock.clauses.some(utils.isDefaultClause)) {
      const swnode = node as ts.SwitchStatement
      const values = getUnionTypes(swnode.expression)
      if (values) {
        const swvals = (swnode.caseBlock.clauses as ts.NodeArray<ts.CaseClause>).map(({ expression }: ts.CaseClause) => getClauseVal(expression))
        const fv = values.filter((v) => swvals.indexOf(v) < 0)
        if (fv.length > 0) {
          ctx.addFailureAtNode(node, `Match not exhaustive, values not matched: ${fv.join(', ')}`)
        }
      }
    } else if (utils.isIfStatement(node)) {
      const { cases, switchVariable } = check(node, ctx.sourceFile)
      if (cases !== undefined && switchVariable !== undefined) {
        const vv = getUnionTypes(switchVariable)
        if (vv) {
          const fv = vv.filter((v) => cases.indexOf(v) < 0)
          if (fv.length > 0) {
            ctx.addFailureAtNode(node, `Match not exhaustive, values not matched: ${fv.join(', ')}`)
          }
        }
      }
    }
    return ts.forEachChild(node, cb)
  })
}

function nodeEquals<T extends ts.Node>(a: T, b: T, sourceFile: ts.SourceFile): boolean {
  return a.getText(sourceFile) === b.getText(sourceFile)
}

function isSimple(node: ts.Node): boolean {
  switch (node.kind) {
    case ts.SyntaxKind.PropertyAccessExpression:
      return isSimple((node as ts.PropertyAccessExpression).expression)
    case ts.SyntaxKind.PrefixUnaryExpression:
      switch ((node as ts.PrefixUnaryExpression).operator) {
        case ts.SyntaxKind.PlusPlusToken:
        case ts.SyntaxKind.MinusMinusToken:
          return false
        default:
          return isSimple((node as ts.PrefixUnaryExpression).operand)
      }
    case ts.SyntaxKind.Identifier:
    case ts.SyntaxKind.NumericLiteral:
    case ts.SyntaxKind.StringLiteral:
    case ts.SyntaxKind.ThisKeyword:
    case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
    case ts.SyntaxKind.TrueKeyword:
    case ts.SyntaxKind.FalseKeyword:
    case ts.SyntaxKind.NullKeyword:
      return true
    default:
      return false
  }
}
