const qsa = require('../qualifySelectApply')
const utils = require('../../utils')

const rule = (promoCode,itemCode,discountedItemCode,discount) => {
    
    const buys = [{
        code: itemCode,
        quantity: 1,
    }]
    const qualifyFn = (items) => utils.hasAllBuys(buys, items, promoCode)
    const markFn = (item) => item.code === itemCode 
    const selectFn = (item) => item.code === discountedItemCode 
    const discountFn = (item) => item.price - (item.price * discount)
  
    const baseRule = qsa.rule(promoCode,qualifyFn,markFn,selectFn,discountFn)

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