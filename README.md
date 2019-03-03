# checkout
A simple checkout application with promotion rules

### Design
I have attempted to keep the code simple and extensible. I have tried to follow a some what of a `functional approach`

The main idea is that any promotion application on cart has to follow these steps:
  1. Check if the cart qualifies for a promotion
  2. Mark the items that qualify for a promotion 
  3. Select the items that have to discounted and compute the discounted price
These steps have to be applied to all the sets of items that qualify. For example if the rule is `3 for 2 deal on Apple TVs - 
if you buy 3 Apple TVs, you will pay the price of 2 only` and the cart contains 6 apple tvs, then promo has to be applied 
to all 6 of them.

The main idea discussed above is implemented as "qualifySelectApply" (all though ideally named as "qualify-mark-select-apply").
This function is defined as follows:

```const rule = (promoCode,qualifyFn,markFn,selectFn,discountFn) => {
    const mark = (items) => {
        const qualifies = qualifyFn(items)
        //... check if qualifes
       
        // ...then mark items as promo sources using markFn
        
        // ...then select items which are the targets for promos
        
        // invoke again, so that all elgible items are marked
        return mark(updated)
    }

    const apply = (items) => {
        // adjust price to discount
       return items.map((item)=>{
       // if the item is marked as a target, apply the adjusted price
            if(item.promos[promoCode] && item.promos[promoCode].target) {
                const adjustedPrice = discountFn(item)
                item.promos[promoCode].price = adjustedPrice
            }
            return item
       })
    }
}````

Creating a rule is simple, the functions `qualifyFn`, `markFn`, `selectFn` and `discountFn` need to be defined.
For example the rule: `free VGA adapter free of charge with every MacBook Pro sold` is coded as:
```
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

    const mark = baseRule.mark // we just use the qualify-select-apply's function directly

    const apply = baseRule.apply // we just use the qualify-select-apply's function directly

    const code = () => promoCode

    return {
        mark,
        apply,
        code,
    }
}

module.exports = {
    rule: rule,
}```

### Testing
To run the tests, follow these steps:
1. npm install (installs mocha, chain, sinon)
2. npm test

The functional tests are defined checkout.spec.js:
```
checkout
    scenarios
      SKUs Scanned: atv, atv, atv, vga
        ✓ Should Total as: $249.00
      SKUs Scanned: atv, ipd, ipd, atv, ipd, ipd, ipd
        ✓ Should Total as: $2718.95
      SKUs Scanned: mbp, vga, ipd
        ✓ Should Total as: $1949.98
```
The other tests are defined in promos.spec.js

