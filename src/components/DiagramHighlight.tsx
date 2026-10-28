'use client';
type Shape = {x:number;y:number;rx?:number;ry?:number;w?:number;h?:number};
export default function DiagramHighlight({shape,label,viewWidth=500,viewHeight=270}:{shape:Shape|null;label:string;viewWidth?:number;viewHeight?:number}){
 if(!shape)return null;
 const {x,y,rx=19,ry=rx,w,h}=shape;
 const box=w!==undefined&&h!==undefined;
 const edgeX=Math.min(viewWidth-135,Math.max(10,x+25));
 const edgeY=Math.max(24,Math.min(viewHeight-12,y-32));
 return <g className="diagram-highlight-layer" pointerEvents="none" aria-hidden="true">
  {box?<rect className="diagram-highlight-ring" x={x-w/2-5} y={y-h/2-5} width={w+10} height={h+10} rx="12"/>:<ellipse className="diagram-highlight-ring" cx={x} cy={y} rx={rx+7} ry={ry+7}/>}
  <circle className="diagram-highlight-target" cx={x} cy={y} r="5"/>
  <path d={`M${x} ${y} L${edgeX+5} ${edgeY+7}`} stroke="#e45c36" strokeWidth="2.5" strokeDasharray="5 4"/>
  <rect x={edgeX} y={edgeY-15} width={Math.min(145,Math.max(78,label.length*7+16))} height="24" rx="8" fill="#fff9e9" stroke="#c34e30" strokeWidth="1.5"/>
  <text x={edgeX+8} y={edgeY+1} fontSize="11" fontWeight="700" fill="#703321">{label}</text>
 </g>;
}
