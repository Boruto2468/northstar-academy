import type {Metadata} from 'next';import './globals.css';import {PwaRegistration} from '@/components/PwaRegistration';
export const metadata:Metadata={title:'Northstar Academy | Year 10',description:'Interactive Year 10 Maths and Biology learning, practice and revision.',manifest:process.env.GITHUB_PAGES==='true'?'/northstar-academy/manifest.webmanifest':'/manifest.webmanifest'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><PwaRegistration/>{children}</body></html>}
