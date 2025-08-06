'use client';
import Link from 'next/link';
import { UserButton, SignInButton, useAuth } from '@clerk/nextjs';

export default function Navbar() {
  const { isSignedIn } = useAuth();

  return (
    <nav className="flex justify-between items-center px-6 py-4 shadow-md">
      {/* Left: App Name or Logo */}
      <Link href="/" className="text-2xl font-bold text-gray-800">
        TikTok Clone
      </Link>

      {/* Right: Navigation Links + Auth */}
      <div className="flex items-center space-x-4">
        {/* Show Upload link only if user is signed in */}
        {isSignedIn && (
          <Link
            href="/upload"
            className="text-blue-600 hover:underline font-medium"
          >
            Upload
          </Link>
        )}

        {/* Auth Buttons */}
        {isSignedIn ? (
          <UserButton afterSignOutUrl="/" />
        ) : (
          <SignInButton />
        )}
      </div>
    </nav>
  );
}
