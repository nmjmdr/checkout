
const getEffectivePrice = (item) => {
    const appliedPromos = Object.keys(item.promos)
    if(appliedPromos.length == 0) {
        return item.price
    }
   
    // we select the first promo, later we can use a strategy to select whicj promo to apply
    // for example, select the promo that leads to cheapest price
    // find the first with target promo set
    const applyThis = appliedPromos.find((key)=>{
        return item.promos[key].target === true
    })
    if(!applyThis) {
        return item.price
    }
    return item.promos[applyThis].price
}

const instance = (promos) => {
    const items = [];
    const scan = (item) => {
        items.push(item)
    }

    const total = () => {
        const promoCodes = promos.codes()
        const updatedItems = promoCodes.reduce((updatedItems,code) => {
            updatedItems = promos.apply(updatedItems, code)
            return updatedItems
        }, items)
        
        const totalPrice = updatedItems.reduce((sum, item) => {
            const effectivePrice = getEffectivePrice(item)
            sum += effectivePrice
            return sum 
        },0)
        return totalPrice
    }

    return {
        scan,
        total,
    }
}


module.exports = {
   instance,
}