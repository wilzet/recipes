import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Recipes',
  description: 'Web app for storing recipes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon/favicon.ico"/>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />
        <link rel="manifest" href="/favicon/manifest.json" />
      </head>
      <body>
        <h1>Our Recipes</h1>
        {children}
      </body>
    </html>
  )
}
