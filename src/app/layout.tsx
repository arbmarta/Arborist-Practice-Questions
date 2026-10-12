import './globals.css';import Shell from '@/components/Shell';
export const metadata={title:{default:'Arborist Study',template:'%s | Arborist Study'},description:'Interactive arboriculture lessons and practice.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><Shell>{children}</Shell></body></html>}
