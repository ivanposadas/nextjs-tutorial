import Pagination from '@/app/components/ui/invoices/pagination';
import Search from '@/app/components/ui/search';
import Table from '@/app/components/ui/invoices/table';
import { CreateInvoice } from '@/app/components/ui/invoices/buttons';
import { lusitana } from '@/app/components/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/components/ui/skeletons';
import { Suspense } from 'react';
import { fetchInvoicesPages } from '@/app/lib/data';
import { auth } from '@/app/lib/auth/auth';

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const totalPages = await fetchInvoicesPages(query, session.user.id);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} ownerId={session.user.id} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}