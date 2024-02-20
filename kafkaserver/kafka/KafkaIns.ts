import { Kafka } from "kafkajs";
const kafka = new Kafka({
	clientId: "client_ID_app_new_v2",
	brokers:["192.168.29.168:9092"]
});
export default kafka;