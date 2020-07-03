import express from 'express'

import CategoryController from './controllers/category.controller'
import CityController from './controllers/city.controller'
import ProductController from './controllers/product.controller'

const routes = express.Router()

routes.get('/categories', CategoryController.index)

routes.get('/citys/:countrie/:state', CityController.index)

routes.get('/search/:item', ProductController.index)
routes.get('/search/sort/:item', ProductController.sort)

export default routes
