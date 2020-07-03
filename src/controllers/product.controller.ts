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
  },

  async sort (request: Request, response:Response) {
    try {
      const searchItem = request.params.item
      const { latitude, longitude } = request.query
      const products = (await axios.get(URL_MELI_API + 'sites/MLB/search?q=' + searchItem)).data.results
      const productsDetails = []
      console.log(latitude, longitude)
      // eslint-disable-next-line no-inner-declarations
      function sortByDistance (products:any, brokenPoint:any) {
        const result = []

        for (const product of products) {
          const distance = Math.pow((brokenPoint.geolocation.latitude - product.geolocation.latitude), 2) +
          Math.pow((brokenPoint.geolocation.longitude - product.geolocation.longitude), 2)
          product.geolocation.distance = distance
          result.push(product)
        }

        result.sort((a:any, b:any) => {
          if (a.geolocation.distance > b.geolocation.distance) {
            return 1
          }
          if (a.geolocation.distance < b.geolocation.distance) {
            return -1
          }
          // a must be equal to b
          return 0
        })

        return result
      }

      for (const product of products) {
        const item = (await axios.get(URL_MELI_API + 'items/' + product.id)).data
        productsDetails.push({
          ...product,
          geolocation: item.geolocation
        })
      }

      const result = sortByDistance(productsDetails, { geolocation: { latitude: latitude, longitude: longitude } })

      return response.status(201).json(result)
    } catch (error) {
      return response.status(400).json({ error })
    }
  }
}
