
import cors from 'cors'
import morgan from 'morgan'
import connectDB from '../../DB/connection.js'
import * as Routers from '../index.router.js'
import { globalResponse } from './errorHandling.js'
import chalk from 'chalk'

const initApp = (app, express) => {

   
    var whitelist = ['http://localhost:3000', 'http://example2.com']
//     var corsOptions = {
//       origin: function (origin, callback) {
//         if (whitelist.indexOf(origin) !== -1) {
//           callback(null, true)
//         } else {
//           callback(new Error('Not allowed by CORS'))
//         }
//       }
//     }

// app.use(cors(corsOptions))

app.use(async (req,res,next) => {
    // if (!whitelist.includes(req.header('origin'))) {
    //    return next(new Error('not allowed by cors',{cause:403})) 
    // }
  await res.header('Access-Control-Allow-Origin','*');
  await res.header('Access-Control-Allow-Headers','*');
  await res.header('Access-Control-Allow-Private-Network','true');
  await res.header('Access-Control-Allow-Methods','PUT');

  next()
}
)


    const port = process.env.PORT || 5000
    if (process.env.ENV_MODE =='DEV') {
        
        app.use(morgan('dev'))
    }else{
        app.use(morgan('combined'))

    }
   
    //convert Buffer Data
    app.use(express.json({}))
    //connect to DB
    connectDB()
    //Setup API Routing 
    app.get('/',(req,res,next) => {
      return res.status(200).json({message:'welcome to our e-commerce :'})
    }
    )
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
    app.all('*', (req, res, next) => {
        res.status(404).send("In-valid Routing Plz check url  or  method")
    })

    // fail response
    app.use(globalResponse)

    app.listen(port, () => console.log(chalk.blue.bold.bgCyan(`Example app listening on port ${port}!`)))

}



export default initApp