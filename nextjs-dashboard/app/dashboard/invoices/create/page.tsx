import Form from '@/app/components/ui/invoices/create-form';
import Breadcrumbs from '@/app/components/ui/invoices/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';
import { auth } from '@/app/lib/auth/auth';

export default async function Page() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const customers = await fetchCustomers(session.user.id);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Create Invoice',
            href: '/dashboard/invoices/create',
            active: true,
          },
        ]}
      />
      <Form customers={customers} ownerId={session.user.id} />
    </main>
  );
}