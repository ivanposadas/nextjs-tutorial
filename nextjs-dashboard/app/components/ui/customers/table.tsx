import Image from 'next/image';
import { lusitana } from '@/app/components/ui/fonts';
import { fetchFilteredCustomers } from '@/app/lib/data';
import { UpdateCustomer, DeleteCustomer } from '@/app/components/ui/customers/buttons';
import { UserCircleIcon } from '@heroicons/react/24/outline';

export default async function CustomersTable({
  query,
  ownerId,
}: {
  query: string;
  ownerId: string;
}) {
  const customers = await fetchFilteredCustomers(query, ownerId);

  function isValidImageUrl(url: string | null): boolean {
    return url !== null && url !== '' && url !== 'null';
  }

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {customers?.map((customer) => (
              <div
                key={customer.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      {isValidImageUrl(customer.image_url) ? (
                        <Image
                          src={customer.image_url!}
                          className="mr-2 rounded-full"
                          width={28}
                          height={28}
                          alt={`${customer.name}'s profile picture`}
                        />
                      ) : (
                        <UserCircleIcon className="mr-2 h-7 w-7 text-gray-400" />
                      )}
                      <p>{customer.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{customer.email}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateCustomer id={customer.id} />
                    <DeleteCustomer id={customer.id} />
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      Total Invoices: {customer.total_invoices}
                    </p>
                    <div className="mt-2 flex gap-4">
                      <p>Pending: {customer.total_pending}</p>
                      <p>Paid: {customer.total_paid}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Customer
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Total Invoices
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Total Pending
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Total Paid
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      {isValidImageUrl(customer.image_url) ? (
                        <Image
                          src={customer.image_url!}
                          className="rounded-full"
                          width={28}
                          height={28}
                          alt={`${customer.name}'s profile picture`}
                        />
                      ) : (
                        <UserCircleIcon className="h-7 w-7 text-gray-400" />
                      )}
                      <p>{customer.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {customer.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {customer.total_invoices}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {customer.total_pending}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {customer.total_paid}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateCustomer id={customer.id} />
                      <DeleteCustomer id={customer.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
