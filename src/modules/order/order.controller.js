import Stripe from 'stripe'
import couponModel from '../../../DB/model/CouponModel.js'
import { validationCoupon } from '../coupon/coupon.controller.js'
import cartModel from '../../../DB/model/CartModel.js'
import productModel from '../../../DB/model/ProductModel.js'
import orderModel from '../../../DB/model/OrderModel.js'
import payment from '../../utils/payment.js'


const createOrder = async (req, res, nxt) => {
  const userId = req.user._id
  const { products, couponCode, address, phone, paymentMethod } = req.body
  // coupon validation
  if (couponCode) {
    const coupon = await couponModel.findOne({ code: couponCode })
    if (!coupon) return nxt(new Error('in-valid coupon code', { cause: 400 }))

    const { matched, exceed, expired } = validationCoupon(coupon, userId)

    if (expired) return nxt(new Error('this coupon is expired', { cause: 400 }))
    
    if (!matched) return nxt(new Error('this coupon is not assgined to you', { cause: 400 }))

    if (exceed) return nxt(new Error('you exceed the max usage of this coupon', { cause: 400 }))

    req.body.coupon = coupon
  }

  if (!products?.length) {
    const cartExist = await cartModel.findOne({ userId })
    if (!cartExist?.products?.length) return nxt(new Error('empty cart', { cause: 400 }))

    req.body.isCart = true
    req.body.products = cartExist.products
  }
  // products validation

  let subTotal = 0
  let finalProducts = []
  let productIds = []
  for (let product of req.body.products) {
    productIds.push(product.productId)
    const findProduct = await productModel.findOne({
      _id: product.productId,
      stock: { $gte: product.quantity },
      isDeleted: false,
    })
    if (!findProduct) return nxt(new Error('invalid product', { cause: 400 }))

    if (req.body.isCart) {
      product = product.toObject()
    }
    product.name = findProduct.name
    product.productPrice = findProduct.priceAfterDiscount
    product.finalPrice = Number.parseFloat(
      findProduct.priceAfterDiscount * product.quantity,
    ).toFixed(2)
    finalProducts.push(product)
    subTotal += parseInt(product.finalPrice)
  }

  paymentMethod == 'cash'
    ? (req.body.orderStatus = 'placed')
    : (req.body.orderStatus = 'pending')

  const orderObject = {
    userId,
    products: finalProducts,
    address,
    phone,
    paymentMethod,
    orderStatus: req.body.orderStatus,
    subTotal,
    couponId: req.body.coupon?._id,
    totalPrice: Number.parseFloat(
      subTotal * (1 - (req.body.coupon?.amount || 0) / 100),
    ).toFixed(2),
  }

  const order = await orderModel.create(orderObject)
  if (order) {
    // increement usageCount => 1
    if (req.body.coupon) {
      for (const user of req.body.coupon?.usagePerUser) {
        if (user.userId.toString() == userId.toString()) {
          user.usageCount += 1
        }
      }
      await req.body.coupon.save()
    }
    // decrement stock => quantity
    for (const product of req.body.products) {
      await productModel.findByIdAndUpdate(product.productId, {
        $inc: { stock: -parseInt(product.quantity) },
      })
    }
    // remove product from cart
    await cartModel.updateOne(
      { userId },
      {
        $pull: { products: { productId: { $in: productIds } } },
      },
    )
    if (order.paymentMethod == 'card') {
      if (req.body.coupon) {
        const stripe = new Stripe(process.env.STRIPE_SERCET_KEY)
        const coupon = await stripe.coupons.create({
          percent_off: req.body.coupon.amount,
        })
        req.body.couponId = coupon.id
      }
      const session = await payment({
        payment_method_types: [order.paymentMethod],
        mode: 'payment',
        customer_email: req.user.email,
        metadata: {
          orderId: order._id.toString(),
        },
        cancel_url: `${process.env.CANCEL_URL}?orderId=${order._id}`,
        success_url: `${process.env.SUCCESS_URL}?orderId=${order._id}`,
        discounts: req.body.couponId ? [{ coupon: req.body.couponId }] : [],
        line_items: order.products.map((product) => {
          return {
            price_data: {
              currency: 'EGP',
              product_data: {
                name: product.name,
              },
              unit_amount: product.productPrice * 100,
            },
            quantity: product.quantity,
          }
        }),
      })
      return res.status(201).json({ message: 'Done', order, session })
    }
  
  }
  res.status(201).json({ message: 'Done', order })
}

const cancelOrder = async (req, res, nxt) => {
  const { orderId } = req.params
  const { reason } = req.body
  const order = await orderModel.findById(orderId)
  if (
    (order?.orderStatus != 'placed' && order?.paymentMethod == 'cash') ||
    (!['confirmed', 'pending'].includes(order?.orderStatus) &&
      order?.paymentMethod == 'card')
  ) {
    return nxt(
      new Error(
        `you canot cancell this order with status ${order.orderStatus}`,
        { cause: 400 },
      ),
    )
  }
  order.orderStatus = 'cancelled'
  order.reason = reason
  order.upadtedBy = req.user._id
  const orderCancelled = await order.save()
  if (orderCancelled) {
    if (order.couponId) {
      const coupon = await couponModel.findById(order.couponId)
      for (const user of coupon?.usagePerUser) {
        if (user.userId.toString() == order.userId.toString()) {
          user.usageCount -= 1
        }
      }
      await coupon.save()
    }
    // decrement stock => quantity
    for (const product of order.products) {
      await productModel.findByIdAndUpdate(product.productId, {
        $inc: { stock: parseInt(product.quantity) },
      })

    }
    res.status(200).json({ message: 'order cancelled succesfully' })
  }
}
const webHook = async (req, res, nxt) => {
  const stripe = new Stripe(process.env.STRIP_SECRET_KEY)
  const endpointSecret = 'whsec_83a46a9d0727689d77d4bf46a739d8dbc4792c8a15050a2e9f5654471f9301f5'
  const sig = req.headers['stripe-signature']
  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret)
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`)
    return
  }
  const { orderId } = event.data.object.metadata
  if (event.type == 'checkout.session.completed') {
    await orderModel.findByIdAndUpdate(orderId, {
      orderStatus: 'confirmed',
    })
    return res.status(200).json({ message: 'Payment successed' })
  }
  await orderModel.findByIdAndUpdate(orderId, {
    orderStatus: 'payment failed',
  })
  return res.status(200).json({ message: 'payment failed' })
}
export {
  createOrder,
  cancelOrder,
  webHook
}