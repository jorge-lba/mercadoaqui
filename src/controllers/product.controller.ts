import { Request, Response } from 'express'
import { config } from 'dotenv'
import axios from 'axios'
import { getDistance } from 'geolib'
import { ConnectionStates } from 'mongoose'

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
          const distance = getDistance(brokenPoint.geolocation, product.geolocation)
          product.geolocation.distance = distance
          result.push(product)
        }
        console.log(getDistance({ latitude: -23.533491, longitude: -47.5041453 }, { latitude: -23.5339328, longitude: -47.5031775 }))
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
