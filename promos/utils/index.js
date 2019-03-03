const hasXBuys = (items, code, x, promo) => {
    const count = items.reduce((count,item)=>{
        if(count === x) {
            // reached the required count
            return count
        }
        if(item.code === code && (!item.promos[promo] || !item.promos[promo].source) ) {
            count = count + 1
        }
        return count
    },0)
    return count === x
}


const hasAllBuys = (buys, items, promo) => {
    const hasAll = buys.reduce((hasAll, buy) => {
        hasAll = hasAll && hasXBuys(items, buy.code, buy.quantity, promo)
        return hasAll
    }, true)
    return hasAll
}


module.exports = {
    hasAllBuys,
    hasXBuys,
}