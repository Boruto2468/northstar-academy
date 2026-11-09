/** Student response projection: marking data is never included until release. */
import type {ItemPublic,ItemSecret} from './items.ts';
export type StoredItemRow={id:string;position:number;topic:string;subtopic:string;item_type:'objective'|'theory';marks:number;public_data:ItemPublic;response:Record<string,string>;grade:Record<string,unknown>|null;secret_data:ItemSecret;teacher_points:number|null};
export function studentItem(row:StoredItemRow,reveal:boolean){
 const publicItem={id:row.id,position:row.position,topic:row.topic,subtopic:row.subtopic,itemType:row.item_type,marks:row.marks,question:row.public_data,response:row.response};
 if(!reveal)return publicItem;
 return {...publicItem,
  grade:row.grade?{...row.grade,points:row.teacher_points===null?row.grade.points:Number(row.teacher_points),teacherAdjusted:row.teacher_points!==null}:null,
  answer:row.secret_data.correctAnswer,workedSolution:row.secret_data.workedSolution,
  markingScheme:row.secret_data.markingScheme,commonWrongAnswers:row.secret_data.commonWrongAnswers
 };
}
