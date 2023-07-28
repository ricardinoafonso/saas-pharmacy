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
      brokers: ["stunning-manatee-14111-us1-kafka.upstash.io:9092"],
      sasl: {
        mechanism: "scram-sha-256",
        username:
          "c3R1bm5pbmctbWFuYXRlZS0xNDExMSS2ZoW8hd-z-5NBE2Qw2M4Tkt1urgwwfqE",
        password: "d6f5a0e2552044fe981210071c036d96",
      },
      ssl: true,
    });
    const consumer = kafka.consumer({ groupId: group });
    return consumer
  }
}
