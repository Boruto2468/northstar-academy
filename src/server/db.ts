import 'server-only';
import {Pool, type PoolClient} from 'pg';
let pool:Pool|undefined;
export function db():Pool {
 if(!process.env.DATABASE_URL)throw new Error('DATABASE_URL is not configured on the server');
 if(!pool){
  const connectionUrl=new URL(process.env.DATABASE_URL);
  for(const parameter of ['sslmode','ssl','sslcert','sslkey','sslrootcert','sslnegotiation'])connectionUrl.searchParams.delete(parameter);
  pool=new Pool({connectionString:connectionUrl.toString(),max:2,
  connectionTimeoutMillis:8000,idleTimeoutMillis:12000,
  ssl:process.env.DATABASE_SSL_CA?{ca:process.env.DATABASE_SSL_CA.replace(/\\n/g,'\n'),rejectUnauthorized:true}:{rejectUnauthorized:true}});
 }
 return pool;
}
export async function transaction<T>(fn:(client:PoolClient)=>Promise<T>):Promise<T>{
 const client=await db().connect();try{await client.query('BEGIN');const result=await fn(client);await client.query('COMMIT');return result;}
 catch(e){await client.query('ROLLBACK').catch(()=>{});throw e;}finally{client.release();}
}
