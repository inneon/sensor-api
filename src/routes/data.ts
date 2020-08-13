import express from 'express'
import { validatePutData } from '../model'
import DataService, { SaveStatus } from '../services/dataService'
import InMemory from '../persistence/inMemory'

const data = express()

const service = new DataService(new InMemory())

data.put('/', async (req, res) => {
  console.log(`Request on /data PUT: ${JSON.stringify(req.body)}`)
  const body = req.body
  if (!validatePutData(body)) {
    return res.sendStatus(400)
  }

  const result = await service.save(body)

  if (result === SaveStatus.duplicate) return res.sendStatus(409)

  return res.sendStatus(200)
})

data.get('/', (req, res) => {
  return res.sendStatus(200)
})

export default data
