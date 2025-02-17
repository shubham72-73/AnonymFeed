export const metadata = {
  title: 'AnonymFeeds',
  description: 'Send and receive messages anonymously',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
