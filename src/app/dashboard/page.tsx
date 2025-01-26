import DashboardContent from './DashboardContent';
import AuthWrapper from '@/lib/components/AuthWrapper';

export default function DashboardPage() {
  return (
    <AuthWrapper requireAuth redirectTo="/login">
      <DashboardContent />
    </AuthWrapper>
  );
} 