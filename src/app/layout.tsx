import type {Metadata} from 'next';import './globals.css';import {PwaRegistration} from '@/components/PwaRegistration';import AccountNav from '@/components/assessments/AccountNav';
export const metadata:Metadata={title:'Northstar Academy | Year 10',description:'Interactive Year 10 Maths and Biology learning, practice and revision.',manifest:'/manifest.webmanifest'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><PwaRegistration/><AccountNav/>{children}</body></html>}
