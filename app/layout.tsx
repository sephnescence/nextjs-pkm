import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Personal Knowledge Management',
  icons: {
    icon: '/pkm.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body className={`${inter.className} bg-black`}>
          <div className="w-screen min-h-screen h-full bg-white/5 flex text-white">
            <div className="max-w-[1200px] w-full mx-auto bg-white/5">
              {children}
            </div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}
