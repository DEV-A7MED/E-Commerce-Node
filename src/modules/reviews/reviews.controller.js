import orderModel from "../../../DB/model/OrderModel.js"
import productModel from "../../../DB/model/ProductModel.js"
import reviewModel from "../../../DB/model/ReviewModel.js"

export const addReview = async (req, res, nxt) => {
    const { productId } = req.params
    // product Id
    const Product = await productModel.findById(productId)
    if (!Product) return nxt(new Error('in-valid productId', { cause: 400 }))

    // user buy the product
    const orders = await orderModel.find({
    userId: req.user._id,
    orderStatus: 'delivered',
    'products.productId': productId,
    })
    if (!orders.length) return nxt(new Error('you canot review product before buy it', { cause: 400 }))
    // check if user make review before
    // const existReview=await reviewModel.find({userId:req.user._id,productId})
    // if(existReview) return nxt(new Error('you already added review', { cause: 400 }))
    // create review
    const review = await reviewModel.create({
    userId: req.user._id,
    productId,
    text: req.body.text,
    rate: req.body.rate,
    })
    return res.status(201).json({ message: 'Done', review })
  }
