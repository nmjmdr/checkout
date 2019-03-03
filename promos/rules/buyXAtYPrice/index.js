const qsa = require('../qualifySelectApply')
const utils = require('../../utils')

const rule = (promoCode,itemCode,x,y) => {
    
    const buys = [{
        code: itemCode,
        quantity: x,
    }]
    const qualifyFn = (items) => utils.hasAllBuys(buys, items, promoCode)
    const selectFn = (item) => item.code === itemCode 
    const discountFn = (item) => y * item.price / x

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