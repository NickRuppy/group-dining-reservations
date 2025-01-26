import AuthWrapper from '@/lib/components/AuthWrapper';
import SignupContent from './SignupContent';

export default function SignupPage() {
  return (
    <AuthWrapper requireAuth={false} redirectTo="/dashboard">
      <SignupContent />
    </AuthWrapper>
  );
} 