import express from 'express'
import { validatePutData, validateGetData } from '../model'
import service, { SaveStatus } from '../services'

const data = express()

data.put('/', async (req, res) => {
  console.log(`Request on /data PUT: ${JSON.stringify(req.body)}`)
  const body = req.body
  if (!validatePutData(body)) {
    return res.sendStatus(400)
  }

  try {
    const result = await service.save(body)

    if (result === SaveStatus.duplicate) return res.sendStatus(409)

    return res.sendStatus(200)
  } catch (err) {
    console.log(err)
    return res.sendStatus(500)
  }
})

data.get('/', async (req, res) => {
  console.log(`Request on /data GET: ${JSON.stringify(req.body)}`)
  const body = req.body
  if (!validateGetData(body)) {
    return res.sendStatus(400)
  }

  try {
    const result = await service.retrieve(body)

    return res
      .status(200)
      .header('content-type', 'application/json')
      .send(JSON.stringify(result))
  } catch (err) {
    console.log(err)
    return res.sendStatus(500)
  }
})

export default data
