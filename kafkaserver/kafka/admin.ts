import kafka from "./KafkaIns";
let init = async()=>{
	const admin = kafka.admin();
	await admin.connect(); // connecting admin
	console.log("[+] Admin Connected");
	await admin.createTopics({
		topics:[
			{
				topic: "actual-stream_v3",
				numPartitions: 10
			}
		]
	});
	await admin.disconnect();
	console.log("[-] Admin disconnected topics are created");
}
init();
export {init};