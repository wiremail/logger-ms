
import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'
import Producer from './producer.mjs'

const app = express()
const producer = new Producer()

app.use(bodyParser.json('application/json'))

app.post('/sendLog', async (req, res) => {
  await producer.publishMessage(req.body.logType, req.body.message)
  res.send('ok')
})

const port = process.env.PORT ?? 3000
app.listen(port, () => {
  console.log(`Server running at port ${port}`)
})