import type { Metadata } from 'next'
import type { Viewport } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'

const nunito = Nunito({ weight: ['400', '700'], subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Datums',
  description:
    'Your information storage and analysis hub for all things private and personal',
}

export const viewport: Viewport = {
  interactiveWidget: 'resizes-content',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel='manifest' href='manifest.json' />
      </head>
      <body className={nunito.className}>{children}</body>
    </html>
  )
}
