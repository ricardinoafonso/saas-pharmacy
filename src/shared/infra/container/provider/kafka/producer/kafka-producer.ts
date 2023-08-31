import { injectable } from "tsyringe";
import { BaseError } from "@errors/Base";
import { Producer, CompressionTypes, Kafka } from "kafkajs";

export interface IKafkaProducer {
  execute(topic: string, payload: any): Promise<void>;
}
@injectable()
export class Producers implements IKafkaProducer {
  private producer: Producer;
  constructor() {
    this.producer = this.producerKafka();
  }
  async execute(topic: string, payload: any): Promise<void> {
    try {
      await this.producer.connect();
      await this.producer.send({
        topic: topic,
        compression: CompressionTypes.GZIP,
        messages: [{ value: JSON.stringify(payload) }],
      });
    } catch (error) {
      throw new BaseError(
        error.message,
        error.stack,
        "kafka",
        400,
        "provider:kafka",
        "kafka"
      );
    } finally {
      await this.producer.disconnect();
    }
  }
  private producerKafka(): Producer {
    const producerkafka = new Kafka({
      brokers: [process.env.KAFKA_BROKER],
      sasl: {
        mechanism: "scram-sha-256",
        username: process.env.KAFKA_USERNAME,
        password: process.env.KAFKA_PASSWORD,
      },
      ssl: true,
    });
    const producer = producerkafka.producer();
    return producer;
  }
}
