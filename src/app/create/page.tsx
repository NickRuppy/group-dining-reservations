import AuthWrapper from '@/lib/components/AuthWrapper';
import CreateReservationContent from './CreateReservationContent';

export default function CreatePage() {
  return (
    <AuthWrapper requireAuth redirectTo="/login">
      <CreateReservationContent />
    </AuthWrapper>
  );
} 