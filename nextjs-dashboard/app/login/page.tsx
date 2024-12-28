'use client';

import { lusitana } from '@/app/ui/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/button';
import { useFormState, useFormStatus } from 'react-dom';
import { authenticate } from '@/app/lib/actions';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const handleSocialLogin = async (provider: 'github' | 'facebook') => {
    try {
      await signIn(provider, {
        callbackUrl: '/dashboard',
      });
    } catch (error) {
      console.error('Social login error:', error);
    }
  };

  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className={`${lusitana.className} text-white`}>
            <p className="text-[32px]">Acme</p>
          </div>
        </div>
        <form action={dispatch} className="space-y-3">
          <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
            <h1 className={`${lusitana.className} mb-3 text-2xl`}>
              Please log in to continue.
            </h1>
            <div className="w-full">
              <div>
                <label
                  className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                  htmlFor="email"
                >
                  Email
                </label>
                <div className="relative">
                  <input
                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    required
                  />
                  <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
              </div>
              <div className="mt-4">
                <label
                  className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    required
                    minLength={6}
                  />
                  <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
              </div>
            </div>
            <LoginButton />
            <div className="flex h-8 items-end space-x-1">
              {error && (
                <>
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                  <p className="text-sm text-red-500">
                    {error === 'OAuthAccountNotLinked'
                      ? 'Email already exists with different provider.'
                      : error === 'OAuthSignin'
                      ? 'Error signing in with provider.'
                      : error === 'OAuthCallback'
                      ? 'Error during authentication callback.'
                      : error === 'OAuthCreateAccount'
                      ? 'Could not create user account.'
                      : 'Authentication error.'}
                  </p>
                </>
              )}
              {errorMessage && (
                <>
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                  <p className="text-sm text-red-500">{errorMessage}</p>
                </>
              )}
            </div>
            <div className="mt-6 flex flex-col gap-2">
              <Button
                className="flex w-full gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  handleSocialLogin('github');
                }}
              >
                Continue with GitHub
              </Button>
              <Button
                className="flex w-full gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  handleSocialLogin('facebook');
                }}
              >
                Continue with Facebook
              </Button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="mt-4 w-full" aria-disabled={pending}>
      Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </Button>
  );
}