import { KafkaConsumer } from "../../../../shared/infra/container/provider/kafka/consumer/kafka-consumer";

const accountUseCaseSendMailVerification = async () => {
  const consumer = new KafkaConsumer("APP_TEST_");
  await consumer.execute("SEND_MAIL", (message) => {
    console.log(message.value.toString());
  });
};

accountUseCaseSendMailVerification();
