import mongoose, { Schema }  from "mongoose";
// have to add sender and receiver validator 
const chatdb = new Schema({
	senderId : {
		type: String,
		required: true

	},

	email:{
		type:String,
		required:true
	},
	receiverId: {
		type: String,
		required: true,
	},
	tousername:{
		type:String,
		required:true
	},
	fromusername:{
		type:String,
		required:true
	},
	message: {
		type: String,
		required : true
	}
},
{
	timestamps:true
}
);
var db = mongoose.model("chatDB", chatdb);
export { db };