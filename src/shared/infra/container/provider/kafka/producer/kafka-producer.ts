import { injectable } from "tsyringe";
import kafka from "../kafka";
import { BaseError } from "@errors/Base";

export interface IKafkaProducer {
  execute(topic: string, payload: any): Promise<void>;
}

@injectable()
export class Producer implements IKafkaProducer {
  async execute(topic: string, payload: any): Promise<void> {
    const producer = kafka.producer();
    try {
      await producer.connect();
      await producer.send({
        topic: topic,
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
      await producer.disconnect();
    }
  }
}
