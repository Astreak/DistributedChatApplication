import mongoose from "mongoose";
let connectDB = ()=>{
	return async(db_uri:any)=>{
		await mongoose.connect(db_uri,{
		} as any).then((d)=>{
			console.log('[+] ChatDB connected');
		});
	}

}
export {connectDB};