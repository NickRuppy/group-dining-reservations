'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { ReservationData, addParticipant } from '@/lib/firebase/reservationUtils';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import Link from 'next/link';

export default function JoinReservationPage({ params }: { params: { id: string } }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [reservation, setReservation] = useState<ReservationData | null>(null);
  const [error, setError] = useState('');
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      // Store the reservation ID in sessionStorage to redirect back after login
      if (params.id) {
        sessionStorage.setItem('joinReservationId', params.id);
      }
      router.push('/login');
    }
  }, [user, loading, router, params.id]);

  useEffect(() => {
    if (!params.id) return;

    const unsubscribe = onSnapshot(
      doc(db, 'reservations', params.id),
      (doc) => {
        if (doc.exists()) {
          setReservation({ id: doc.id, ...doc.data() } as ReservationData);
        } else {
          setError('Reservation not found');
        }
      },
      (error) => {
        console.error('Error fetching reservation:', error);
        setError('Error loading reservation');
      }
    );

    return () => unsubscribe();
  }, [params.id]);

  if (loading || !reservation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  const isOrganizer = user?.uid === reservation.organizerId;
  const isParticipant = reservation.participants.some(p => p.userId === user?.uid);
  const availableSeats = reservation.totalSeats - reservation.filledSeats;
  const canJoin = !isOrganizer && !isParticipant && availableSeats > 0 && reservation.status === 'upcoming';

  const handleJoin = async () => {
    if (!canJoin || !user) return;

    setJoining(true);
    try {
      await addParticipant(params.id, user.uid, user.displayName || 'Anonymous');
      router.push(`/reservations/${params.id}`);
    } catch (err) {
      console.error('Error joining reservation:', err);
      setError('Failed to join reservation');
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Join Reservation</h2>
            <p className="mt-2 text-gray-600">
              {reservation.restaurantName}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {new Date(reservation.date).toLocaleDateString()} at {reservation.time}
            </p>
          </div>

          <div className="mt-4">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6">
              <div>
                <dt className="text-sm font-medium text-gray-500">Organizer</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {reservation.participants.find(p => p.userId === reservation.organizerId)?.name}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Available Seats</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {availableSeats} of {reservation.totalSeats}
                </dd>
              </div>
              {reservation.requiresDeposit && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Required Deposit</dt>
                  <dd className="mt-1 text-sm text-gray-900">${reservation.depositAmount}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="mt-6">
            {isParticipant ? (
              <div className="text-center">
                <p className="text-sm text-gray-600">You&apos;re already part of this reservation.</p>
                <Link
                  href={`/reservations/${params.id}`}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  View Reservation
                </Link>
              </div>
            ) : isOrganizer ? (
              <div className="text-center">
                <p className="text-sm text-gray-600">You&apos;re the organizer of this reservation.</p>
                <Link
                  href={`/reservations/${params.id}`}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  View Reservation
                </Link>
              </div>
            ) : availableSeats === 0 ? (
              <p className="text-center text-sm text-red-600">
                Sorry, this reservation is full.
              </p>
            ) : reservation.status !== 'upcoming' ? (
              <p className="text-center text-sm text-red-600">
                This reservation is no longer accepting participants.
              </p>
            ) : (
              <button
                onClick={handleJoin}
                disabled={joining}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {joining ? 'Joining...' : 'Join Reservation'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 