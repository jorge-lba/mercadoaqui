import express from 'express'

import CategoryController from './controllers/category.controller'

const routes = express.Router()

routes.get('/categories', CategoryController.index)

export default routes
