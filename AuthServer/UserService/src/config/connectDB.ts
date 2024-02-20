import { Client } from 'pg';
import 'dotenv/config';
var connectionString: string | undefined = process.env.DB_URI;
var client = new Client({
   connectionString: connectionString,
});
try {
   client.connect()
      .then(() => {
         console.log('[+] Postgres DB Connected');
      }).catch((err: any) => {
         console.log(`Error : ${err}`);
      });
} catch(Ex) {
      
}

export default client;
