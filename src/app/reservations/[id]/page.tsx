import AuthWrapper from '@/lib/components/AuthWrapper';
import ReservationContent from './ReservationContent';

export default function ReservationPage({ params }: { params: { id: string } }) {
  return (
    <AuthWrapper requireAuth redirectTo="/login">
      <ReservationContent params={params} />
    </AuthWrapper>
  );
} 