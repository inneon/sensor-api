import express from 'express'
import { validatePutData } from '../model'

const data = express()

data.put('/', (req, res) => {
  console.log(`${req.body} was sent`)

  const body = req.body
  if (!validatePutData(body)) {
    return res.sendStatus(400)
  }

  return res.sendStatus(200)
})

data.get('/', (req, res) => {
  console.log(`${req.body} was requested`)
  return res.sendStatus(200)
})

export default data
