import { 
  collection, 
  query, 
  where, 
  getDocs,
  getDoc,
  addDoc, 
  updateDoc,
  doc,
  Timestamp,
  orderBy,
  DocumentData
} from 'firebase/firestore';
import { db } from './firebase';

export interface ReservationData {
  id: string;
  restaurantName: string;
  address: string;
  date: string;
  time: string;
  totalSeats: number;
  filledSeats: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  organizerId: string;
  participants: {
    userId: string;
    name: string;
    status: 'confirmed' | 'pending';
  }[];
  notes?: string;
  requiresDeposit?: boolean;
  depositAmount?: number;
}

interface Participant {
  userId: string;
  name: string;
  status: 'confirmed' | 'pending';
}

export async function getUserReservations(userId: string) {
  const reservations: ReservationData[] = [];
  
  // Get reservations where user is organizer
  const organizerQuery = query(
    collection(db, 'reservations'),
    where('organizerId', '==', userId),
    orderBy('date', 'desc')
  );

  // Get reservations where user is participant
  const participantQuery = query(
    collection(db, 'reservations'),
    where('participants', 'array-contains', { userId }),
    orderBy('date', 'desc')
  );

  try {
    const [organizerSnap, participantSnap] = await Promise.all([
      getDocs(organizerQuery),
      getDocs(participantQuery)
    ]);

    organizerSnap.forEach(doc => {
      reservations.push({ id: doc.id, ...doc.data() } as ReservationData);
    });

    participantSnap.forEach(doc => {
      // Avoid duplicates if user is both organizer and participant
      if (!reservations.find(r => r.id === doc.id)) {
        reservations.push({ id: doc.id, ...doc.data() } as ReservationData);
      }
    });

    // Sort reservations by date
    return reservations.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error('Error fetching reservations:', error);
    throw error;
  }
}

export async function createReservation(data: Omit<ReservationData, 'id'>) {
  try {
    const docRef = await addDoc(collection(db, 'reservations'), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }
}

export async function updateReservation(id: string, data: Partial<ReservationData>) {
  try {
    const reservationRef = doc(db, 'reservations', id);
    await updateDoc(reservationRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating reservation:', error);
    throw error;
  }
}

export async function addParticipant(
  reservationId: string, 
  userId: string, 
  name: string
) {
  try {
    const reservationRef = doc(db, 'reservations', reservationId);
    const reservationSnap = await getDoc(reservationRef);
    const reservationData = reservationSnap.data() as DocumentData;

    await updateDoc(reservationRef, {
      participants: [...(reservationData?.participants || []), {
        userId,
        name,
        status: 'pending'
      }],
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error adding participant:', error);
    throw error;
  }
}

export async function updateParticipantStatus(
  reservationId: string,
  userId: string,
  status: 'confirmed' | 'pending'
) {
  try {
    const reservationRef = doc(db, 'reservations', reservationId);
    const reservationSnap = await getDoc(reservationRef);
    const reservationData = reservationSnap.data() as DocumentData;
    
    if (!reservationData) throw new Error('Reservation not found');

    const updatedParticipants = (reservationData.participants as Participant[]).map(p => 
      p.userId === userId ? { ...p, status } : p
    );

    await updateDoc(reservationRef, {
      participants: updatedParticipants,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating participant status:', error);
    throw error;
  }
} 