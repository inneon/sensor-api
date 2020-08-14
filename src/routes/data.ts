import express from 'express'
import { validatePutData } from '../model'
import DataService, { SaveStatus } from '../services/dataService'
// import InMemory from '../persistence/inMemory'
import { RedisClient } from '../persistence'
import { validateGetData } from '../model/data'

const data = express()

// todo - put in startup section and ensure cleaned up
const service = new DataService(new RedisClient())

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

data.get('/', async (req, res) => {
  console.log(`Request on /data GET: ${JSON.stringify(req.body)}`)
  const body = req.body
  if (!validateGetData(body)) {
    return res.sendStatus(400)
  }

  const result = await service.retrieve(body)

  return res
    .status(200)
    .header('content-type', 'application/json')
    .send(JSON.stringify(result))
})

export default data
