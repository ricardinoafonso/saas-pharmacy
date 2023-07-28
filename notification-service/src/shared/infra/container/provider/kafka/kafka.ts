import { Kafka } from "kafkajs";
const kafka = new Kafka({
  brokers: ["stunning-manatee-14111-us1-kafka.upstash.io:9092"],
  sasl: {
    mechanism: "scram-sha-256",
    username: "c3R1bm5pbmctbWFuYXRlZS0xNDExMSS2ZoW8hd-z-5NBE2Qw2M4Tkt1urgwwfqE",
    password: "d6f5a0e2552044fe981210071c036d96",
  },
  ssl: true,
});

export default kafka