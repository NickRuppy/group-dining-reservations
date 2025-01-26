"use client";

import Image from 'next/image';
import { useAuth } from '@/lib/hooks/useAuth';

export default function SignInWithGoogle() {
  const { signInWithGoogle } = useAuth();

  return (
    <button
      onClick={signInWithGoogle}
      className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <Image
        src="/google-icon.png"
        alt="Google"
        width={20}
        height={20}
        priority
      />
      Sign in with Google
    </button>
  );
}
