

import connectDB from '../../DB/connection.js'
import * as Routers from '../index.router.js'
import { globalResponse } from './errorHandling.js'


const initApp = (app, express) => {
    const port = process.env.PORT || 5000

    //convert Buffer Data
    // app.use(express.json({}))
    app.use((req, res, nxt) => {
        if (req.originalUrl == '/order/webhook') {
            nxt()
        } 
        else {
            express.json({})(req, res, nxt)
        }
    })
    //connect to DB
    connectDB()
    //Setup API Routing 
    app.use(`/auth`, Routers.authRouter)
    app.use(`/user`, Routers.userRouter)
    app.use(`/product`, Routers.productRouter)
    app.use(`/category`, Routers.categoryRouter)
    app.use(`/subCategory`, Routers.subcategoryRouter)
    app.use(`/reviews`, Routers.reviewsRouter)
    app.use(`/coupon`, Routers.couponRouter)
    app.use(`/cart`, Routers.cartRouter)
    app.use(`/order`, Routers.orderRouter)
    app.use(`/brand`, Routers.branRouter)
    // in-valid routings
    app.all('*', (req, res, nxt) => {
        res.send("In-valid Routing Plz check url  or  method")
    })

    // fail response
    app.use(globalResponse)

    app.listen(port, () => console.log(`Server Running On Port ${port}!`))

}



export default initApp;