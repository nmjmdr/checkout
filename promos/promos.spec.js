const chai = require("chai")
const expect = chai.expect
const sinon = require('sinon')
const buyXAtYPrice= require('./rules/buyXAtYPrice')
const carts = require('../carts')
const promotions= require('./index')
const bulkDiscount = require('./rules/bulkDiscount')
const buyXGetYDiscount = require('./rules/buyXGetYAtDiscount')

describe("promos", ()=> {
    let sandbox
    const promos = promotions.promos()

    beforeEach(()=>{
      sandbox = sinon.createSandbox();
    })
    afterEach(()=>{
      sandbox.restore()
    })
    
    describe("Buy 3 at price of 2 deal",()=>{
        const promoCode = 'buy3at2'
        const itemCode = 'atv'
        const price = 100
    
        promos.add(promoCode,buyXAtYPrice.rule(promoCode,itemCode,3,2))
        
        describe("Given that there are 3 buys of the item in the cart", ()=>{
            it("Should set the promo price to that of 2 items", () => {
                const cart = carts.cart()
                const numberOfItems = 3
                for(i=0;i<numberOfItems;i++) {
                    cart.add(itemCode,price)
                }
                const items = cart.get()
                const updatedItems = promos.apply(items,promoCode)
                // check the promo price
                const computedPrice = 2 * price / numberOfItems
                const result = updatedItems.reduce((result, item)=>{
                    return result && item.promos[promoCode] && item.promos[promoCode].price === computedPrice

                }, true)
                expect(result).to.be.true
            })
        })

        describe("Given that there are less than 3 buys of the item in the cart", ()=>{
            it("Should NOT set the promo price to that of 2 items", () => {
                const cart = carts.cart()
                const numberOfItems = 2
                for(i=0;i<numberOfItems;i++) {
                    cart.add(itemCode,price)
                }
                const items = cart.get()
                const updatedItems = promos.apply(items,promoCode)
                // should not have set the promo
                const result = updatedItems.reduce((result, item)=>{
                    return result && !item.promos[promoCode]

                }, true)
                expect(result).to.be.true
            })
        })
        
        describe("Given that there are two sets of 3 buys of the item in the cart", ()=>{
            it("Should set the promo price to that of 2 items for both the sets", () => {
                const cart = carts.cart()
                const numberOfItems = 6
                for(i=0;i<numberOfItems;i++) {
                    cart.add(itemCode,price)
                }
                const items = cart.get()
                const updatedItems = promos.apply(items,promoCode)
                // check the promo price
                const computedPrice = 2 * price / 3
                const result = updatedItems.reduce((result, item)=>{
                    return result && item.promos[promoCode] && item.promos[promoCode].price === computedPrice

                }, true)
                expect(result).to.be.true
            })
        })
    })
    
    describe("Buy more than 4 get all at discounted price",()=>{
        const promoCode = 'bulk'
        const itemCode = 'ipd'
        const price = 100
        const discountedPrice = 80
        const moreThan4 = 5

        promos.add(promoCode,bulkDiscount.rule(promoCode,itemCode,moreThan4,discountedPrice))
        
        describe("Given that there are more than 4 buys of the item in the cart", ()=>{
            it("Should set the promo price to discounted price", () => {
                const cart = carts.cart()
                const numberOfItems = 6
                for(i=0;i<numberOfItems;i++) {
                    cart.add(itemCode,price)
                }
                const items = cart.get()
                const updatedItems = promos.apply(items,promoCode)
                // check the promo price
                const result = updatedItems.reduce((result, item)=>{
                    return result && item.promos[promoCode] && item.promos[promoCode].price === discountedPrice

                }, true)
                expect(result).to.be.true
            })
        })
        
        
        describe("Given that there are less than 5 buys of the item in the cart", ()=>{
            it("Should NOT set the promo price to that of 2 items", () => {
                const cart = carts.cart()
                const numberOfItems = 4
                for(i=0;i<numberOfItems;i++) {
                    cart.add(itemCode,price)
                }
                const items = cart.get()
                const updatedItems = promos.apply(items,promoCode)
                // should not have set the promo
                const result = updatedItems.reduce((result, item)=>{
                    return result && !item.promos[promoCode]

                }, true)
                expect(result).to.be.true
            })
        })
        
        
    })
    
    describe("Buy x item and get y discounted price",()=>{
        const promoCode = 'buyXGetYDiscount'
        const itemCode = 'mbp'
        const discountedItemCode = 'vga'
        const price = 100
        const discount = 1.0

        promos.add(promoCode,buyXGetYDiscount.rule(promoCode,itemCode,discountedItemCode,discount))
        
        describe("Given that there are item that match the deal in the cart", ()=>{
            it("Should set the promo price to target item to discounted price", () => {
                const cart = carts.cart()
                cart.add(itemCode, 1000)
                cart.add(discountedItemCode,price)
                const items = cart.get()
                const updatedItems = promos.apply(items,promoCode)
                // check the promo price
                const updatedDiscountItem = updatedItems.find((item)=>{
                    return item.code == discountedItemCode
                })
                expect(updatedDiscountItem.promos[promoCode].price).be.equal(price - price * discount)
            })
        })
        
        
        describe("Given that there is no item that triggers the discount", ()=>{
            it("Should NOT set the discount for the target item", () => {
                const cart = carts.cart()
                cart.add('some-other-item', 1000)
                cart.add(discountedItemCode,price)
                const items = cart.get()
                const updatedItems = promos.apply(items,promoCode)
                // check the promo price
                const updatedDiscountItem = updatedItems.find((item)=>{
                    return item.code == discountedItemCode
                })
                expect(!updatedDiscountItem.promos[promoCode]).be.true
                
            })
        })
        
        
    })
    
})