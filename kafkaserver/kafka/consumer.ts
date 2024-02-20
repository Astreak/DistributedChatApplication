import kafka from "./KafkaIns";
import { db } from "../config/SchemaDB";
var consumerConnect = async (group:any)=>{
	const consumer = kafka.consumer({groupId:group});
	await consumer.connect();
	await consumer.subscribe({topic: "actual-stream_v3", fromBeginning: true});
	await consumer.run({
		eachMessage:async({topic, partition,message,heartbeat,pause })=>{
			// insert in db here
			const bufferS:any = message.value;
			db.create(JSON.parse(bufferS.toString()))
			.then((d)=>{
				//console.log("returned data", d);
				console.log("[+] Data inserted successfully in database");
			})
			.catch((ex)=>{
				console.log(`Erro: ${ex}`);
			});
			console.log(`Topic: ${topic} -- Partition: ${partition} --- Message: ${message.value?.toString()}`);
		}
	});
}
//consumerConnect();
export {consumerConnect};