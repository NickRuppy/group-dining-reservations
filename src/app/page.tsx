import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Organize group dinners</span>
              <span className="block text-blue-600">effortlessly!</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Create, manage, and join group restaurant reservations with ease. Split payments, invite friends, and keep everyone in the loop.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  href="/signup"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                >
                  Sign Up
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link
                  href="/login"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                >
                  Log In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              How It Works
            </h2>
          </div>
          <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-3">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center">
                <div className="h-12 w-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Create a Reservation</h3>
                <p className="mt-2 text-base text-gray-500">
                  Set up your group dining event with restaurant details, date, and number of seats
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center">
                <div className="h-12 w-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-blue-600">2</span>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Invite Friends</h3>
                <p className="mt-2 text-base text-gray-500">
                  Share the reservation link with friends and let them join with one click
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center">
                <div className="h-12 w-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-blue-600">3</span>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Manage Everything</h3>
                <p className="mt-2 text-base text-gray-500">
                  Track RSVPs, collect payments, and keep everyone updated in one place
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
