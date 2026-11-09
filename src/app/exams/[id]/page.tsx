import {redirect} from 'next/navigation';
export default async function ExamDetail({params}:{params:Promise<{id:string}>}){redirect('/exams');}
