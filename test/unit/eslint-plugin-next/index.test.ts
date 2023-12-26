import { basename } from 'path'
import glob from 'glob'
import index from 'eslint-plugin-neer'

const getRuleNameFromRulePath = (path) => basename(path, '.js')
const rulePaths = glob.sync('packages/eslint-plugin-next/dist/rules/*js', {
  absolute: true,
})

describe('eslint-plugin-neer index', () => {
  it('should include all defined rules and no extra / undefined rules', () => {
    const rules = rulePaths.map((rulePath) => getRuleNameFromRulePath(rulePath))

    expect(index.rules).toContainAllKeys(rules)
  })

  rulePaths.forEach((rulePath) => {
    let rule = require(rulePath)
    rule = rule.default ?? rule
    const ruleName = getRuleNameFromRulePath(rulePath)
    const { recommended = false } = rule.meta.docs

    it(`${ruleName}: recommend should be \`${recommended}\``, () => {
      expect(
        `neer/${ruleName}` in index.configs.recommended.rules
      ).toBe(recommended)
    })
  })
})
