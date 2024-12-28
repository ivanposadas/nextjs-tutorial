import { fetchFilteredCustomers } from '@/app/lib/data';
import { lusitana } from '@/app/components/ui/fonts';
import Search from '@/app/components/ui/search';
import Table from '@/app/components/ui/customers/table';
import { TableRowSkeleton } from '@/app/components/ui/skeletons';
import { Suspense } from 'react';
import { auth } from '@/app/lib/auth/auth';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { PlusIcon } from '@heroicons/react/24/outline';

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const query = searchParams?.query || '';

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Customers</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search customers..." />
        <Link href="/dashboard/customers/create">
          <Button>
            Create Customer <PlusIcon className="h-5 w-5 ml-2" />
          </Button>
        </Link>
      </div>
      <Suspense key={query} fallback={<TableRowSkeleton />}>
        <Table query={query} ownerId={session.user.id} />
      </Suspense>
    </div>
  );
}