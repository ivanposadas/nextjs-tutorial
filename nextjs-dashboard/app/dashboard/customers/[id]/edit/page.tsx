import { fetchCustomerById } from '@/app/lib/data';
import Breadcrumbs from '@/app/components/ui/invoices/breadcrumbs';
import Form from '@/app/components/ui/customers/edit-form';
import { notFound } from 'next/navigation';
import { auth } from '@/app/lib/auth/auth';

export default async function Page({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const id = params.id;
  const customer = await fetchCustomerById(id, session.user.id);

  if (!customer) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Customers', href: '/dashboard/customers' },
          {
            label: 'Edit Customer',
            href: `/dashboard/customers/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form customer={customer} ownerId={session.user.id} />
    </main>
  );
} 