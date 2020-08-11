import express from 'express'
import { internal, data } from './routes'
import bodyParser from 'body-parser'

const PORT = 3000

const app = express()

app.use(bodyParser.json())
app.use('/internal', internal)
app.use('/data', data)

app.listen(PORT, () => console.log(`App listening on http://localhost:${PORT}`))
