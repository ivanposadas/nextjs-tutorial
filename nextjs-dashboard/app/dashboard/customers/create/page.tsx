import { auth } from '@/app/lib/auth/auth';
import Breadcrumbs from '@/app/components/ui/invoices/breadcrumbs';
import Form from '@/app/components/ui/customers/create-form';

export default async function Page() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Customers', href: '/dashboard/customers' },
          {
            label: 'Create Customer',
            href: '/dashboard/customers/create',
            active: true,
          },
        ]}
      />
      <Form ownerId={session.user.id} />
    </main>
  );
} 