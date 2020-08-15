import express from 'express'
import { validateAlertSubscription } from '../model'

const alerts = express()

alerts.put('/', (req, res) => {
  console.log(`Request on /alerts PUT: ${JSON.stringify(req.body)}`)
  const body = req.body
  if (!validateAlertSubscription(body)) {
    return res.sendStatus(400)
  }

  try {
    res.sendStatus(200)
  } catch (err) {
    console.log(err)
    return res.sendStatus(500)
  }
})

export default alerts
