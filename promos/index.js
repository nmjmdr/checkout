

const promos = () => {
    const m = {}
    const add = (promoCode, rule) => {
        m[promoCode] = rule
    }
    const apply = (items, promoCode) => {
        if(!m[promoCode]) {
            console.log(`${promoCode} not found in promos`)
            return items
        }
        const markedItems = m[promoCode].mark(items)
        const updatedItems = m[promoCode].apply(markedItems)
        return updatedItems
    }
    const codes = () => Object.keys(m)
    return {
        apply,
        add,
        codes,
    }
}


module.exports = {
    promos: promos,
}