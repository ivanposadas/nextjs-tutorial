'use client';

import { UserCircleIcon, AtSymbolIcon, PhotoIcon, XCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { updateCustomer, type CustomerState } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import { useState } from 'react';

export default function EditCustomerForm({
  customer,
  ownerId,
}: {
  customer: {
    id: string;
    name: string;
    email: string;
    image_url: string | null;
  };
  ownerId: string;
}) {
  const initialState: CustomerState = { message: '', errors: {} };
  const updateCustomerWithId = updateCustomer.bind(null, customer.id, ownerId);
  const [state, dispatch] = useFormState(updateCustomerWithId, initialState);
  const [imageUrl, setImageUrl] = useState<string>(
    customer.image_url && customer.image_url !== 'null' ? customer.image_url : ''
  );

  const handleRemoveImage = () => {
    setImageUrl('');
  };

  const handleSubmit = async (formData: FormData) => {
    formData.set('image_url', imageUrl || '');
    dispatch(formData);
  };

  return (
    <form action={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Name
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={customer.name}
              placeholder="Enter customer name"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="name-error"
            />
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          {state.errors?.name ? (
            <div id="name-error" aria-live="polite" className="mt-2 text-sm text-red-500">
              {state.errors.name.map((error: string) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          ) : null}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={customer.email}
              placeholder="Enter customer email"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="email-error"
            />
            <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          {state.errors?.email ? (
            <div id="email-error" aria-live="polite" className="mt-2 text-sm text-red-500">
              {state.errors.email.map((error: string) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          ) : null}
        </div>

        {/* Image URL */}
        <div className="mb-4">
          <label htmlFor="image_url" className="mb-2 block text-sm font-medium">
            Image URL (Optional)
          </label>
          <div className="relative">
            <input
              id="image_url"
              name="image_url"
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/customer-image.jpg"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <PhotoIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            {imageUrl && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <XCircleIcon className="h-5 w-5 text-gray-500 hover:text-red-500" />
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/customers"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Edit Customer</Button>
      </div>
    </form>
  );
} 