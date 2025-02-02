import Form from '@/app/components/ui/invoices/edit-form';
import Breadcrumbs from '@/app/components/ui/invoices/breadcrumbs';
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { auth } from '@/app/lib/auth/auth';

export default async function Page({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const id = params.id;
  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id, session.user.id),
    fetchCustomers(session.user.id),
  ]);

  if (!invoice) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={invoice} customers={customers} ownerId={session.user.id} />
    </main>
  );
}