/** Node/server only. Never import this file into a client component. */
import {createHmac} from 'node:crypto';
export function tawkSecureHash(userId:string,apiKey:string):string {
 if(!/^[0-9a-f-]{36}$/i.test(userId)||!apiKey)throw new Error('Invalid support signature input');
 return createHmac('sha256',apiKey).update(userId).digest('hex');
}
