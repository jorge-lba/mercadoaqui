import { Request, Response } from 'express'
import { config } from 'dotenv'
import axios from 'axios'

config()

const URL_MELI_API = process.env.URL_MELI_API

export default {
  async index (request: Request, response:Response) {
    try {
      const { countrie, state } = request.params
      const citys = (await axios.get(URL_MELI_API + 'classified_locations/states/' + `${countrie}-${state}`)).data.cities
      const citysDetails = []

      for (const city of citys) {
        const details = (await axios.get(URL_MELI_API + 'classified_locations/cities/' + city.id)).data
        citysDetails.push({
          ...city,
          geo_information: details.geo_information.location
        })
      }

      return response.status(201).json(citysDetails)
    } catch (error) {
      return response.status(400).json({ error })
    }
  }
}
