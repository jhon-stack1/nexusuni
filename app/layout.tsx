import type { Metadata } from 'next'
import { Poppins, Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'UniPath — Your University Admission Guide',
  description:
    'Find your dream university, discover scholarships, predict merit instantly, and get AI-powered admission guidance. Pakistan\'s most premium university admission platform.',
  keywords: 'university admission, scholarships, merit calculator, entry test, Pakistan universities',
  openGraph: {
    title: 'UniPath — Your University Admission Guide',
    description: 'AI-powered university admission platform for Pakistan students.',
    type: 'website',
  },
}

export const viewport = {
  themeColor: '#0B1F3A',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable} bg-background`} suppressHydrationWarning>
      <body className="antialiased" style={{ fontFamily: 'Inter, sans-serif' }}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
