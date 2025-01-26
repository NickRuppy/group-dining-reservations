import AuthWrapper from '@/lib/components/AuthWrapper';
import JoinContent from './JoinContent';

export default function JoinPage({ params }: { params: { id: string } }) {
  return (
    <AuthWrapper requireAuth redirectTo="/login">
      <JoinContent params={params} />
    </AuthWrapper>
  );
} 