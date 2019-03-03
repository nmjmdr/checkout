const chai = require("chai")
const expect = chai.expect
const sinon = require('sinon')
const checkout = require('./index')
const promotions = require('../promos')
const buyXAtYPrice = require('../promos/rules/buyXAtYPrice')
const bulkDiscount = require('../promos/rules/bulkDiscount')
const buyXGetYDiscount = require('../promos/rules/buyXGetYAtDiscount');
const carts = require('../carts')

describe("checkout", ()=> {
    let sandbox
   

    beforeEach(()=>{
      sandbox = sinon.createSandbox();
    })
    afterEach(()=>{
      sandbox.restore()
    })
    
    describe("scenarios", () => {
        const promos = promotions.promos()
        const promoCode1 = 'buy3at2'
        promos.add(promoCode1,buyXAtYPrice.rule(promoCode1,'atv',3,2))

        const promoCode2 = 'bulk'
        const moreThan4 = 5
        const discountedPrice = 499.99
        promos.add(promoCode2,bulkDiscount.rule(promoCode2,'ipd',moreThan4,discountedPrice))

        const promoCode3 = 'buyMacbookGetAdapterFree'
        const discount = 1.0
        promos.add(promoCode3,buyXGetYDiscount.rule(promoCode3,'mbp','vga',discount))

        describe("SKUs Scanned: atv, atv, atv, vga", () => {
            it("Should Total as: $249.00", () => {
                const c = checkout.instance(promos)
                const cart = carts.cart()
                cart.add('atv', 109.50)
                cart.add('atv', 109.50)
                cart.add('atv', 109.50)
                cart.add('vga', 30.00)
                const items = cart.get()
                items.forEach((item) => {
                    c.scan(item)
                })
                const totalPrice = c.total()
                expect(totalPrice).be.equal(249)
            })
        })
        
        describe("SKUs Scanned: atv, ipd, ipd, atv, ipd, ipd, ipd ", () => {
            it("Should Total as: $2718.95", () => {
                const c = checkout.instance(promos)
                const cart = carts.cart()
                cart.add('atv', 109.50)
                cart.add('ipd', 549.99)
                cart.add('ipd', 549.99)
                cart.add('atv', 109.50)
                cart.add('ipd', 549.99)
                cart.add('ipd', 549.99)
                cart.add('ipd', 549.99)
                const items = cart.get()
                items.forEach((item) => {
                    c.scan(item)
                })
                const totalPrice = c.total()
                expect(totalPrice).be.equal(2718.95)
            })
        })

        describe("SKUs Scanned: mbp, vga, ipd", () => {
            it("Should Total as: $1949.98", () => {
                const c = checkout.instance(promos)
                const cart = carts.cart()
                cart.add('mbp',1399.99)
                cart.add('vga',30.00)
                cart.add('ipd', 549.99)
               
                const items = cart.get()
                items.forEach((item) => {
                    c.scan(item)
                })
                const totalPrice = c.total()
                expect(totalPrice).be.equal(1949.98)
            })
        })
    })
})