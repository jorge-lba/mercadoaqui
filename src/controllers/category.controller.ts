import { Request, Response } from 'express'
import { config } from 'dotenv'
import axios from 'axios'

config()

const URL_MELI_API = process.env.URL_MELI_API

export default {
  async index (request: Request, response:Response) {
    try {
      const params:any = request.query
      const itemsPerPage = typeof params.amount === 'number' ? params.amount : 3
      const numberPage = typeof params.page === 'number' ? params.page : 1
      const page = numberPage * itemsPerPage
      const categories = await axios.get(URL_MELI_API + '/sites/MLB/categories')
      const categoriesFull = []

      for (let i = page - itemsPerPage; i < page; i++) {
        const category = categories.data[i]
        const details = await axios.get(URL_MELI_API + '/categories/' + category.id)
        categoriesFull.push({
          ...category,
          picture: details.data.picture,
          permalink: details.data.permalink
        })
      }
      return response.status(201).json(categoriesFull)
    } catch (error) {
      return response.status(400).json({ error })
    }
  }
}
