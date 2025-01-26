'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import Link from 'next/link';
import { ReservationData, getUserReservations } from '@/lib/firebase/reservationUtils';

export default function DashboardContent() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [fetchingReservations, setFetchingReservations] = useState(true);

  useEffect(() => {
    async function fetchReservations() {
      if (user) {
        try {
          const userReservations = await getUserReservations(user.uid);
          setReservations(userReservations);
        } catch (error) {
          console.error('Error fetching reservations:', error);
        } finally {
          setFetchingReservations(false);
        }
      }
    }

    fetchReservations();
  }, [user]);

  if (fetchingReservations) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  const upcomingReservations = reservations.filter(r => r.status === 'upcoming');
  const pastReservations = reservations.filter(r => r.status !== 'upcoming');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Welcome, {user?.displayName}
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            href="/create"
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create New Reservation
          </Link>
        </div>
      </div>

      {/* Upcoming Reservations */}
      <div className="mt-8">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Upcoming Reservations
        </h3>
        <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
          {upcomingReservations.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {upcomingReservations.map((reservation) => (
                <li key={reservation.id}>
                  <Link href={`/reservations/${reservation.id}`} className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-blue-600 truncate">
                            {reservation.restaurantName}
                          </p>
                          {reservation.organizerId === user?.uid && (
                            <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              Organizer
                            </span>
                          )}
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="text-sm text-gray-500">
                            {reservation.filledSeats}/{reservation.totalSeats} seats
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="text-sm text-gray-500">
                            {new Date(reservation.date).toLocaleDateString()} at {reservation.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-6 text-gray-500">
              No upcoming reservations
            </div>
          )}
        </div>
      </div>

      {/* Past Reservations */}
      <div className="mt-8">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Past Reservations
        </h3>
        <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
          {pastReservations.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {pastReservations.map((reservation) => (
                <li key={reservation.id}>
                  <Link href={`/reservations/${reservation.id}`} className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-600 truncate">
                            {reservation.restaurantName}
                          </p>
                          <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            reservation.status === 'completed' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="text-sm text-gray-500">
                            {new Date(reservation.date).toLocaleDateString()} at {reservation.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-6 text-gray-500">
              No past reservations
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 