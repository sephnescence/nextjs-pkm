import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Innsight',
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
        <body className={`${inter.className} bg-slate-950 text-blue-100`}>
          <div className="w-screen min-h-screen h-full flex">
            <div className="w-full mx-auto">{children}</div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}
