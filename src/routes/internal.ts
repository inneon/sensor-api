import express from 'express'

const internal = express()

internal.get('/healthcheck', (_req, res) => {
  res.status(200).send('success')
})

export default internal
