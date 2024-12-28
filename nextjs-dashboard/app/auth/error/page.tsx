'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <main className="flex h-screen items-center justify-center">
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-bold text-red-500">Authentication Error</h1>
        <div className="text-gray-600">
          {error === 'Configuration' && (
            <p>There is a problem with the server configuration.</p>
          )}
          {error === 'AccessDenied' && (
            <p>You do not have permission to sign in.</p>
          )}
          {error === 'EmailSignin' && (
            <p>The sign in link is no longer valid.</p>
          )}
          {error === 'OAuthSignin' && (
            <p>Error occurred while signing in with the provider.</p>
          )}
          {error === 'OAuthCallback' && (
            <p>Error occurred while processing the sign in callback.</p>
          )}
          {error === 'OAuthCreateAccount' && (
            <p>Could not create user account in the database.</p>
          )}
          {error === 'Callback' && (
            <p>Error occurred during the authentication callback.</p>
          )}
          {!error && <p>An unknown error occurred.</p>}
        </div>
        <Link
          href="/login"
          className="block text-blue-500 hover:text-blue-700 underline"
        >
          Back to Login
        </Link>
      </div>
    </main>
  );
} 