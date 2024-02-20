import { init } from "./admin";
import kafka from "./KafkaIns";
let producerConnect = async(message:any)=>{
	//await init();
	let evaluatePartition = Math.floor(message.senderId/10) % 10;
	const producer =  kafka.producer();
	await producer.connect();
	console.log("[+] Producer Connected");
	console.log(evaluatePartition);
	await producer.send({
		topic:"actual-stream_v3",
		messages:[
			{
				partition: evaluatePartition,
				key: "some-data",
				value: JSON.stringify(message)
			},
			
		]
	});
	await producer.disconnect();
}
export {producerConnect};