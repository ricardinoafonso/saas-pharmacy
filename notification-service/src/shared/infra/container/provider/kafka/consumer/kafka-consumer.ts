import { Consumer, Kafka } from "kafkajs";

export class KafkaConsumer {
  private consumer: Consumer;
  constructor( group: string) {
    this.consumer = this.createKafkaConsumer(group);
  }
  async execute(topic: string, callback: (message: any) => void): Promise<any> {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: topic, fromBeginning: true });
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        callback(message);
      },
    });
  }
  private createKafkaConsumer(group: string): Consumer {
    const kafka = new Kafka({
      brokers: [process.env.KAFKA_BROKER],
      sasl: {
        mechanism: "scram-sha-256",
        username: process.env.KAFKA_USERNAME,
        password: process.env.KAFKA_PASSWORD,
      },
      ssl: true,
    });
    const consumer = kafka.consumer({ groupId: group });
    return consumer
  }
}
