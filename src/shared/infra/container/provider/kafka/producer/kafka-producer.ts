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
      brokers: ["stunning-manatee-14111-us1-kafka.upstash.io:9092"],
      sasl: {
        mechanism: "scram-sha-256",
        username:
          "c3R1bm5pbmctbWFuYXRlZS0xNDExMSS2ZoW8hd-z-5NBE2Qw2M4Tkt1urgwwfqE",
        password: "d6f5a0e2552044fe981210071c036d96",
      },
      ssl: true,
    });
    const producer = producerkafka.producer();
    return producer;
  }
}
