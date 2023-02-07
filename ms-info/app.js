import amqp from 'amqplib'
import 'dotenv/config'

const routingKey = 'info'
const queue = 'InfoQueue'

async function consumeMessages() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL)
  const channel = await connection.createChannel()

  await channel.assertExchange(process.env.GATEWAY, "direct")

  const q = await channel.assertQueue(queue)

  await channel.bindQueue(q.queue, process.env.GATEWAY, routingKey)

  channel.consume(q.queue, (msg) => {
    const data = JSON.parse(msg.content)
    console.log(data)
    channel.ack(msg)
  })
}

consumeMessages()