import CardWrapper from '@/app/components/ui/dashboard/cards';
import RevenueChart from '@/app/components/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/components/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/components/ui/fonts';
import { Suspense } from 'react';
import { 
    CardsSkeleton,
    LatestInvoicesSkeleton,
    RevenueChartSkeleton 
} from '@/app/components/ui/skeletons';
import { auth } from '@/app/lib/auth/auth';

export default async function Page() {
    const session = await auth();
    if (!session?.user?.id) {
        return null;
    }

    return (
        <main>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Dashboard
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Suspense fallback={<CardsSkeleton />}>
                    <CardWrapper ownerId={session.user.id} />
                </Suspense>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                <Suspense fallback={<RevenueChartSkeleton />}>
                    <RevenueChart ownerId={session.user.id} />
                </Suspense>
                <Suspense fallback={<LatestInvoicesSkeleton />}>
                    <LatestInvoices ownerId={session.user.id} />
                </Suspense>
            </div>
        </main>
    );
}