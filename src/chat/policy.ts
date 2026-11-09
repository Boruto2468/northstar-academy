/** Side-effect-free, deliberately conservative policy checks for child-facing chat. */
export type ChatCategory='subject_question'|'site_problem';
export type ChatActor='student'|'teacher'|'ai';
export const MESSAGE_LIMIT=1400;
export const TOPIC_WORDS:Record<string,string[]>={
 'decimals':['decimal','round','rounding','estimate','estimation','significant','place value','recurring'],
 'special-numbers':['prime','factor','multiple','hcf','lcm','divisibility'],
 surds:['surd','square root','rationalise','radical'],
 fractions:['fraction','numerator','denominator','mixed number'],
 percentages:['percentage','percent','interest','depreciation','discount','increase','decrease'],
 'ratio-proportion':['ratio','proportion','direct','inverse','share'],
 'indices-standard-form':['indices','index','exponent','power','standard form','scientific notation'],
 'degree-accuracy':['bound','accuracy','rounding','error','tolerance','significant'],
 'sets-venn':['set','venn','intersection','union','complement','subset'],
 'algebra':['algebra','factor','expand','simplify','equation','quadratic','simultaneous'],
 'living-organisms':['organism','living','life process','mrs gren','classification','species','vertebrate','invertebrate','kingdom','biodiversity','sampling','ecology'],
 'cell-structure':['cell','nucleus','membrane','cytoplasm','chloroplast','mitochondri','specialised','tissue','microscop','magnification','organelle'],
 'cell-movement':['diffusion','osmosis','transport','concentration','gradient','membrane','water potential','exchange'],
 'molecules-enzymes':['enzyme','substrate','denatur','food test','benedict','biuret','iodine','carbohydrate','lipid','protein','temperature','ph'],
 'plant-nutrition':['plant','photosynthesis','chlorophyll','chloroplast','glucose','light','limiting','leaf','stomata','carbon dioxide'],
 'plant-transport':['xylem','phloem','transpiration','translocation','root','water','stomata','mineral','guard cell']
};
export function permittedTopic(s:string):boolean{return Object.hasOwn(TOPIC_WORDS,s);}
export function normalizeContextPath(value:unknown):string{
 if(typeof value!=='string'||!value.startsWith('/')||value.startsWith('//'))return '/';
 const path=value.split(/[?#]/)[0].slice(0,240);
 return /^\/[a-zA-Z0-9/_-]*$/.test(path)?path:'/';
}
export function safeActions(value:unknown):string[]{
 if(!Array.isArray(value))return [];
 return value.filter(x=>typeof x==='string').slice(-8).map(x=>x.replace(/[^\w\s/.:_-]/g,'').slice(0,90));
}
export function isSimpleCurriculumQuestion(text:string,topicId:string):boolean{
 const words=TOPIC_WORDS[topicId];if(!words||text.length<8||text.length>360)return false;
 const t=text.trim().toLowerCase();
 if(!/^(what (is|are|does)|why (does|do|is|are)|how (does|do|is|are)|explain|define|describe|give (me )?a (simple )?example|what's the difference|can you explain)/.test(t))return false;
 if(/\b(exam|test|quiz|assessment|question\s*\d+|my grade|answer key|give (me )?the answer|personal|phone|address|password|email|secret|politic|dating|medical|diagnos|suicid|self.harm)\b/i.test(t))return false;
 return words.some(word=>t.includes(word));
}
/** In-progress status is authoritative: timeouts are settled by the server, not by the child's clock. */
export function mayUseAI(input:{isStudent:boolean;category:ChatCategory;teacherAvailable:boolean;hasInProgressAttempt:boolean;modelConfigured:boolean;simple:boolean}):boolean{
 return input.isStudent&&input.category==='subject_question'&&!input.teacherAvailable&&!input.hasInProgressAttempt&&input.modelConfigured&&input.simple;
}
export function teacherOnline(override:string|null,lastActivity:string|null,nowMs:number):boolean{
 if(override==='away')return false;
 if(override==='available')return true;
 return !!lastActivity&&Number.isFinite(Date.parse(lastActivity))&&nowMs-Date.parse(lastActivity)<5*60*1000;
}
