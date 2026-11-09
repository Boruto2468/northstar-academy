// node scripts/create-teacher.mjs (set INITIAL_TEACHER_USERNAME, INITIAL_TEACHER_NAME, INITIAL_TEACHER_PASSWORD and DATABASE_URL)
import {Pool} from 'pg';import {randomBytes,scrypt as scryptCb} from 'node:crypto';import {promisify} from 'node:util';
const username=process.env.INITIAL_TEACHER_USERNAME?.trim().toLowerCase(),displayName=process.env.INITIAL_TEACHER_NAME?.trim(),password=process.env.INITIAL_TEACHER_PASSWORD;
if(!process.env.DATABASE_URL||!username||!displayName||!password||!(/^[a-z0-9._-]{3,36}$/).test(username)||password.length<12)throw Error('Configure DATABASE_URL, INITIAL_TEACHER_USERNAME, INITIAL_TEACHER_NAME and a password of at least 12 characters');
const salt=randomBytes(24).toString('hex');const key=await promisify(scryptCb)(password,salt,64,{N:32768,r:8,p:1,maxmem:64*1024*1024});
const connectionUrl=new URL(process.env.DATABASE_URL);
for(const parameter of ['sslmode','ssl','sslcert','sslkey','sslrootcert','sslnegotiation'])connectionUrl.searchParams.delete(parameter);
const ssl=process.env.DATABASE_SSL_CA?{ca:process.env.DATABASE_SSL_CA.replace(/\\n/g,'\n'),rejectUnauthorized:true}:{rejectUnauthorized:true};
const pool=new Pool({connectionString:connectionUrl.toString(),ssl,max:1});
try{await pool.query('INSERT INTO users(username,display_name,role,password_hash) VALUES($1,$2,$3,$4)',[username,displayName,'teacher',`scrypt$32768$8$1$${salt}$${key.toString('hex')}`]);console.log('Teacher account created:',username);}finally{await pool.end();}
