// Persits all connected users in the server
class ConnectedUser{
	_userEmail:string
	_sockId:string
	static _allConnectedUsers: any = []; // enforce strict type
	static _indexedUsers:any = {id: 0}; // enforce strict type
	constructor(name:string, socketId:string){
		this._userEmail = name;
		this._sockId = socketId;
		ConnectedUser.setConnectedUser(this._userEmail, this._sockId);
	}
	static setConnectedUser(usere: string, sckid:string):void{
		if(ConnectedUser._indexedUsers[usere] === undefined){
			ConnectedUser._allConnectedUsers.push({userEmail: usere, sockid:sckid });
			let len = ConnectedUser._allConnectedUsers.length;
			ConnectedUser._indexedUsers[ConnectedUser._allConnectedUsers[len-1].userEmail] = ConnectedUser._allConnectedUsers.length - 1;
		}
	}
	static async checkUser(value: string):Promise<Object|null>{
		let func = async ()=>{
			// for(let i =0 ;i<this._allConnectedUsers.length;i++){
			// 	if(ConnectedUser._allConnectedUsers[i].userEmail === value ) return this._allConnectedUsers[i];
			// }
			if(ConnectedUser._indexedUsers[value]===undefined){
				return null;
			}else{
				return ConnectedUser._allConnectedUsers[ConnectedUser._indexedUsers[value]];
			}
		}
		var userData = await func();
		return userData ;
	}
	static async disconnectUser(value: string): Promise<void>{
		for(let i =0 ;i<ConnectedUser._allConnectedUsers.length;i++){
			if(ConnectedUser._allConnectedUsers[i].userEmail === value ){
				delete ConnectedUser._indexedUsers[value];
				ConnectedUser._allConnectedUsers.splice(i,1);
				console.log("Disconnected");
				return ;
			}
		}
		return ;
	}
	get userEmail():string{
		return this._userEmail;
	}
	set userEmail(tmp:string){
		this._userEmail = tmp;
	}
}
export default ConnectedUser;