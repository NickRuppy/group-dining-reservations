import AuthWrapper from '@/lib/components/AuthWrapper';
import LoginContent from './LoginContent';

export default function LoginPage() {
  return (
    <AuthWrapper requireAuth={false} redirectTo="/dashboard">
      <LoginContent />
    </AuthWrapper>
  );
} 