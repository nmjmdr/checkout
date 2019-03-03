const cart = () => {
    const items = []
    const add = (code, price) => {
        items.push({
            code: code,
            price: price,
            promos: {}
        })
    }

    const get = () => {
        return items
    }
    
    return {
        add,
        get,
    }
} 

module.exports = {
    cart: cart,
}