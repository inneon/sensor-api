import Express from 'express'

const PORT = 3000

const app = Express()

app.get('/internal/healthcheck', (_req, res) => {
  res.status(200).send('success')
})

app.listen(PORT, () => console.log(`App listening on http://localhost:${PORT}`))
