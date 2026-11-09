import AssessmentRunner from '@/components/assessments/AssessmentRunner';
export default async function AttemptPage({params}:{params:Promise<{id:string}>}){return <AssessmentRunner attemptId={(await params).id}/>;}
