/** Pure, server-side time and release policy. All arguments are server/DB timestamps. */
export function isExamOpen(opensAt:string,closesAt:string,now:string):boolean{
 const t=Date.parse(now);return Number.isFinite(t)&&t>=Date.parse(opensAt)&&t<Date.parse(closesAt);
}
export function deadlineAt(startedAt:string,durationSeconds:number,closesAt?:string):string{
 const limit=Date.parse(startedAt)+durationSeconds*1000;
 return new Date(closesAt?Math.min(limit,Date.parse(closesAt)):limit).toISOString();
}
export function canReveal(kind:'test'|'exam',status:string,now:string,closesAt:string|null,releaseAt:string|null,releaseNow:boolean):boolean{
 if(status!=='submitted')return false;
 if(kind==='test')return true;
 if(!closesAt||Date.parse(now)<Date.parse(closesAt))return false;
 return releaseNow||Boolean(releaseAt&&Date.parse(now)>=Date.parse(releaseAt));
}
