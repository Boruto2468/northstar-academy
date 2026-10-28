'use client';
import {useState} from 'react';
import DiagramHighlight from './DiagramHighlight';
const descriptions:Record<string,string>={
 'Cell membrane':'Phospholipid bilayer with embedded proteins; regulates entry and exit of substances.',
 'Cell wall':'Rigid cellulose layer outside the membrane; maintains shape and prevents bursting.',
 'Cytoplasm':'Fluid cytosol and suspended structures; site of many enzyme-controlled reactions.',
 'Nucleus':'Double-membraned compartment containing chromosomes (DNA) and a nucleolus.',
 'Nucleolus':'Dense nuclear region where ribosomal components are assembled.',
 'Mitochondrion':'Double membrane with folded inner cristae; aerobic respiration generates ATP.',
 'Rough ER':'Flattened membrane network studded with ribosomes; synthesises and transports proteins.',
 'Smooth ER':'Membrane network involved in lipid synthesis and detoxification.',
 'Golgi apparatus':'Stacked membrane sacs that modify, sort and package proteins into vesicles.',
 'Ribosomes':'Small particles that assemble proteins from amino acids.',
 'Chloroplast':'Double-membraned photosynthetic organelle with stacked thylakoid membranes (grana).',
 'Vacuole':'Large fluid-filled compartment containing cell sap; helps maintain turgor pressure.'};
const anatomy:Record<string,{x:number;y:number;rx?:number;ry?:number;w?:number;h?:number}>={
 'Cell wall':{x:375,y:54,w:540,h:15},
 'Cell membrane':{x:375,y:72,w:510,h:10},
 'Cytoplasm':{x:163,y:313,rx:30,ry:35},
 'Nucleus':{x:306,y:243,rx:87,ry:78},
 'Nucleolus':{x:326,y:253,rx:26,ry:26},
 'Chloroplast':{x:535,y:110,rx:62,ry:32},
 'Vacuole':{x:478,y:241,w:220,h:252},
 'Mitochondrion':{x:203,y:120,rx:57,ry:28},
 'Rough ER':{x:190,y:205,rx:38,ry:35},
 'Smooth ER':{x:408,y:221,rx:34,ry:38},
 'Golgi apparatus':{x:455,y:394,rx:60,ry:40},
 'Ribosomes':{x:193,y:202,rx:30,ry:25}
};
export default function DetailedCellDiagram(){const [plant,setPlant]=useState(true),[selected,setSelected]=useState('Nucleus');const labels=plant?['Cell wall','Cell membrane','Cytoplasm','Nucleus','Nucleolus','Chloroplast','Vacuole','Mitochondrion','Rough ER','Golgi apparatus','Ribosomes']:['Cell membrane','Cytoplasm','Nucleus','Nucleolus','Mitochondrion','Rough ER','Smooth ER','Golgi apparatus','Ribosomes'];
return <figure className="cell-atlas"><div className="diagram-top"><div><strong>Cell anatomy atlas</strong><p>Detailed schematic — structures are not drawn to scale</p></div><div className="control-row"><button aria-pressed={plant} onClick={()=>{setPlant(true);setSelected('Chloroplast')}}>Plant</button><button aria-pressed={!plant} onClick={()=>{setPlant(false);setSelected('Mitochondrion')}}>Animal</button></div></div>
<svg viewBox="0 0 760 500" role="img" aria-label={`${plant?'Plant':'Animal'} cell organelle cross-section, interactive labels`} className="cell-atlas-svg">
<defs><linearGradient id="cytosol" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#eff8d6"/><stop offset="1" stopColor="#c5e5d7"/></linearGradient><linearGradient id="nucleus" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#c4b2e8"/><stop offset="1" stopColor="#7e79b9"/></linearGradient><pattern id="dots" width="23" height="19" patternUnits="userSpaceOnUse"><circle cx="8" cy="7" r="1.5" fill="#508b81" opacity=".35"/></pattern></defs>
{plant?<><rect x="105" y="48" width="540" height="402" rx="62" fill="#8ab87a" stroke="#426c45" strokeWidth="15"/><rect x="120" y="63" width="510" height="372" rx="50" fill="url(#cytosol)" stroke="#3d988a" strokeWidth="5"/></>:<path d="M135 122 C195 36 510 38 612 127 C693 205 636 389 495 429 C343 475 120 420 99 292 C86 213 91 178 135 122Z" fill="url(#cytosol)" stroke="#358e85" strokeWidth="7"/>}
<path d={plant?'M125 95 H625 V410 H125Z':'M135 122 C195 36 510 38 612 127 C693 205 636 389 495 429 C343 475 120 420 99 292 C86 213 91 178 135 122Z'} fill="url(#dots)" opacity=".6"/>
{plant&&<><rect x="368" y="115" width="220" height="252" rx="75" fill="#d3ebf5" fillOpacity=".84" stroke="#7db7c5" strokeWidth="5"/><path d="M400 160 Q480 132 549 178" fill="none" stroke="#fff" strokeWidth="7" opacity=".65"/></>}
{[[203,120,-17],[530,375,18],...(plant?[[210,363,38]]:[])].map(([x,y,a],i)=><g key={i} transform={`translate(${x} ${y}) rotate(${a})`}><ellipse rx="57" ry="28" fill="#e8aa76" stroke="#ae643f" strokeWidth="3"/><ellipse rx="49" ry="21" fill="#f8d2a0" stroke="#d68a58" strokeWidth="2"/><path d="M-39 0 Q-28 -17 -18 0 T4 0 T27 0 T43 0" fill="none" stroke="#b96643" strokeWidth="5"/></g>)}
{plant&&[[535,110,-24],[205,258,35],[535,285,17]].map(([x,y,a],i)=><g key={i} transform={`translate(${x} ${y}) rotate(${a})`}><ellipse rx="62" ry="32" fill="#82b967" stroke="#397e55" strokeWidth="3"/><ellipse rx="55" ry="25" fill="#a5d88d" stroke="#5c9b67" strokeWidth="2"/>{[-30,-10,10,30].map(v=><g key={v}><rect x={v-8} y="-13" width="16" height="26" rx="7" fill="#458957"/><path d={`M${v-8} -5 h16 M${v-8} 4 h16`} stroke="#bbde93" strokeWidth="2"/></g>)}</g>)}
<g transform="translate(306 243)"><ellipse rx="87" ry="78" fill="url(#nucleus)" stroke="#655a9a" strokeWidth="6"/><ellipse rx="75" ry="66" fill="none" stroke="#e6d7f6" strokeWidth="2" strokeDasharray="9 6"/><circle cx="20" cy="10" r="26" fill="#685487"/><circle cx="11" cy="2" r="9" fill="#927cb1"/>{[[-45,-25],[-35,35],[10,-40],[55,-18]].map(([x,y],i)=><path key={i} d={`M${x} ${y} q12 -9 21 4 t-3 14`} fill="none" stroke="#7562a5" strokeWidth="3"/>)}</g>
<g fill="none" stroke="#5c96b8" strokeWidth="8" strokeLinecap="round">{[-1,0,1].map((i)=><path key={i} d={`M175 ${205+i*15} Q205 ${190+i*14} 220 ${200+i*14} M380 ${208+i*16} Q408 ${186+i*16} 423 ${205+i*16}`} />)}</g>
<g fill="#263e58">{Array.from({length:21},(_,i)=><circle key={i} cx={175+(i%7)*7} cy={188+Math.floor(i/7)*14} r="2.7"/>)}</g>
<g transform="translate(455 394)" fill="none" stroke="#a978b4" strokeWidth="9" strokeLinecap="round">{[0,1,2,3].map(i=><path key={i} d={`M${-48+i*5} ${-24+i*15} Q0 ${-45+i*15} 49 ${-24+i*15}`}/>)}</g>
{[['Nucleus',306,165,280,36],['Mitochondrion',203,120,33,73],['Rough ER',195,207,30,195],['Golgi apparatus',460,397,567,465],...(plant?[['Chloroplast',535,110,585,30],['Vacuole',489,232,660,240],['Cell wall',118,335,30,407]]:[])].map(([name,x,y,tx,ty])=><g key={String(name)}><path d={`M${x} ${y} L${tx} ${ty}`} stroke="#435f64" strokeWidth="1.7" strokeDasharray="4 3"/><circle cx={Number(x)} cy={Number(y)} r="4" fill="#315d62"/><text x={Number(tx)} y={Number(ty)-5} fontSize="12" fontWeight="700" fill="#263f49">{name}</text></g>)}
<DiagramHighlight shape={selected?anatomy[selected]:null} label={selected} viewWidth={760} viewHeight={500}/></svg><div className="diagram-labels">{labels.map(label=><button key={label} className={selected===label?'selected':''} aria-pressed={selected===label} onClick={()=>setSelected(label)}>{label}</button>)}</div><figcaption className="diagram-detail"><strong>{selected}</strong> — {descriptions[selected]}</figcaption></figure>}
