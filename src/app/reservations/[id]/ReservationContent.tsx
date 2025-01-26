'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { ReservationData, updateReservation } from '@/lib/firebase/reservationUtils';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';

export default function ReservationContent({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const router = useRouter();
  const [reservation, setReservation] = useState<ReservationData | null>(null);
  const [error, setError] = useState('');
  const [copying, setCopying] = useState(false);

  useEffect(() => {
    if (!params.id) return;

    // Subscribe to reservation updates
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

  if (!reservation) {
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
  const confirmedParticipants = reservation.participants.filter(p => p.status === 'confirmed');
  const pendingParticipants = reservation.participants.filter(p => p.status === 'pending');
  const availableSeats = reservation.totalSeats - reservation.filledSeats;
  const inviteLink = `${window.location.origin}/join/${params.id}`;

  const handleCopyLink = async () => {
    setCopying(true);
    try {
      await navigator.clipboard.writeText(inviteLink);
      setTimeout(() => setCopying(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setCopying(false);
    }
  };

  const handleCancel = async () => {
    if (!isOrganizer) return;
    
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      try {
        await updateReservation(params.id, { status: 'cancelled' });
      } catch (err) {
        console.error('Error cancelling reservation:', err);
        setError('Failed to cancel reservation');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            {reservation.restaurantName}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {new Date(reservation.date).toLocaleDateString()} at {reservation.time}
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          {isOrganizer && reservation.status === 'upcoming' && (
            <button
              onClick={handleCancel}
              className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Cancel Reservation
            </button>
          )}
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {copying ? 'Copied!' : 'Copy Invite Link'}
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Reservation Details */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Reservation Details
            </h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd className="mt-1 text-sm text-gray-900">{reservation.address}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    reservation.status === 'upcoming' 
                      ? 'bg-green-100 text-green-800'
                      : reservation.status === 'completed'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Total Seats</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {reservation.filledSeats}/{reservation.totalSeats} filled
                </dd>
              </div>
              {reservation.notes && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Notes</dt>
                  <dd className="mt-1 text-sm text-gray-900">{reservation.notes}</dd>
                </div>
              )}
              {reservation.requiresDeposit && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Deposit Required</dt>
                  <dd className="mt-1 text-sm text-gray-900">${reservation.depositAmount}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* Participants */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Participants
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {availableSeats} {availableSeats === 1 ? 'seat' : 'seats'} available
            </p>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {confirmedParticipants.map((participant) => (
                <li key={participant.userId} className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">
                        {participant.name}
                        {participant.userId === reservation.organizerId && (
                          <span className="ml-2 text-xs text-blue-600">(Organizer)</span>
                        )}
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Confirmed
                    </span>
                  </div>
                </li>
              ))}
              {pendingParticipants.map((participant) => (
                <li key={participant.userId} className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">
                        {participant.name}
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 