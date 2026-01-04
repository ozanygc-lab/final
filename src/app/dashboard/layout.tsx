import { requireAuth } from '@/lib/auth'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Protect all dashboard pages - redirects to /login if not authenticated
  await requireAuth()

  return <>{children}</>
}
