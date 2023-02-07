import amqp from "amqplib"
import "dotenv/config"

class Producer {
  channel

  async createChannel() {
    const connection = await amqp.connect(process.env.RABBITMQ_URL)
    this.channel = await connection.createChannel()
  }

  async publishMessage(routingKey, message) {
    if (!this.channel) {
      await this.createChannel()
    }

    const gateway = process.env.GATEWAY
    await this.channel.assertExchange(gateway, "direct")

    const logDetails = {
      logType: routingKey,
      message: message,
      dateTime: new Date(),
    }

    await this.channel.publish(
      gateway,
      routingKey,
      Buffer.from(JSON.stringify(logDetails))
    )

    console.log(`The new ${routingKey} log is sent to ${gateway}`)
  }
}

export default Producer