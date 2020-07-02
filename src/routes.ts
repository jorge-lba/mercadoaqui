import express from 'express'

import CategoryController from './controllers/category.controller'
import CityController from './controllers/city.controller'

const routes = express.Router()

routes.get('/categories', CategoryController.index)

routes.get('/citys/:countrie/:state', CityController.index)

export default routes
