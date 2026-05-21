import type { Metadata } from 'next'
import { LoginForm } from '@/components/admin/login-form'

export const metadata: Metadata = {
  title: 'Administration — OPEN PF',
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <span className="open-logo-mark" aria-hidden="true" />
          <h1>OPEN PF</h1>
          <p>Administration</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
