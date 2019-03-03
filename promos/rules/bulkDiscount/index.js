const qsa = require('../qualifySelectApply')
const utils = require('../../utils')

const rule = (promoCode,itemCode,xOrMore, discountedPrice) => {
    const buys = [{
        code: itemCode,
        quantity: xOrMore,
    }]
    const qualifyFn = (items) => utils.hasAllBuys(buys, items, promoCode)
    const selectFn = (item) => item.code === itemCode
    const discountFn = (item) => discountedPrice

    const baseRule = qsa.rule(promoCode,qualifyFn,selectFn,selectFn,discountFn)

    const mark = baseRule.mark

    const apply = baseRule.apply

    const code = () => promoCode

    return {
        mark,
        apply,
        code,
    }
}

module.exports = {
    rule: rule,
}