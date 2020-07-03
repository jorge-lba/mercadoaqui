import { Request, Response } from 'express'
import { config } from 'dotenv'
import axios from 'axios'

config()

const URL_MELI_API = process.env.URL_MELI_API

export default {
  async index (request: Request, response:Response) {
    try {
      const searchItem = request.params.item
      const products = (await axios.get(URL_MELI_API + 'sites/MLB/search?q=' + searchItem)).data.results
      const productsDetails = []

      for (const product of products) {
        const item = (await axios.get(URL_MELI_API + 'items/' + product.id)).data
        productsDetails.push({
          ...product,
          geolocation: item.geolocation
        })
      }

      return response.status(201).json(productsDetails)
    } catch (error) {
      return response.status(400).json({ error })
    }
  }
}
