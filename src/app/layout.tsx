import type {Metadata} from 'next';import './globals.css';import {PwaRegistration} from '@/components/PwaRegistration';
const basePath=process.env.NEXT_PUBLIC_BASE_PATH||'';
export const metadata:Metadata={title:'Northstar Academy | Year 10',description:'Interactive Year 10 Maths and Biology learning, practice and revision.',manifest:`${basePath}/manifest.webmanifest`,icons:{icon:`${basePath}/icon.svg`}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><PwaRegistration/>{children}</body></html>}
