import AuthLayout from '@/components/auth/auth-layout'
import SignupForm from '@/components/auth/signup-form'

export const metadata = {
  title: 'Create Account — UniPath',
  description: 'Create your free UniPath account and start discovering universities, scholarships, and more.',
}

export default function SignupPage() {
  return (
    <AuthLayout 
      pageKey="signup"
      panelHeading="Find Your Perfect University"
      panelSubtext="Join thousands of students discovering their future."
    >
      <SignupForm />
    </AuthLayout>
  )
}
