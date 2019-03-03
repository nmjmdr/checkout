

const rule = (promoCode,qualifyFn,markFn,selectFn,discountFn) => {
    const mark = (items) => {
        const qualifies = qualifyFn(items)
        if(!qualifies) {
            return items
        }
        const updated = items.map((item)=>{

            if(markFn(item)) {
                if(!item.promos[promoCode]) {
                    item.promos[promoCode] = {}
                }
                item.promos[promoCode].source = true
            }

            if(selectFn(item)) {
                if(!item.promos[promoCode]) {
                    item.promos[promoCode] = {}
                }
                item.promos[promoCode].target = true
            }
            return item
        })
        // invoke again, so that all elgible items are marked
        return mark(updated)
    }

    const apply = (items) => {
        // adjust price to discount
       return items.map((item)=>{
            if(item.promos[promoCode] && item.promos[promoCode].target) {
                const adjustedPrice = discountFn(item)
                item.promos[promoCode].price = adjustedPrice
            }
            return item
       })
    }

    return {
        mark,
        apply,
        code: ()=>promoCode,
    }
}

module.exports = {
    rule: rule,
}