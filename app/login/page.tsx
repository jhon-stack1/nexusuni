import AuthLayout from '@/components/auth/auth-layout'
import LoginForm from '@/components/auth/login-form'

export const metadata = {
  title: 'Sign In — UniPath',
  description: 'Sign in to your UniPath account to explore universities, scholarships, and merit lists.',
}

export default function LoginPage() {
  return (
    <AuthLayout 
      pageKey="login" 
      panelHeading="Welcome Back to UniPath"
      panelSubtext="Your university journey continues here."
    >
      <LoginForm />
    </AuthLayout>
  )
}
