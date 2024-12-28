'use server'
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signOut } from '@/app/lib/auth/auth';

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: 'Please select a customer.',
    }),
    amount: z.coerce
        .number()
        .gt(0, { message: 'Please enter an amount greater than $0.' }),
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: 'Please select an invoice status.',
    }),
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
};

export async function createInvoice(ownerId: string, prevState: State, formData: FormData) {
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        };
    }

    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    try {
        await sql`
            INSERT INTO invoices (customer_id, amount, status, date, owner_id)
            VALUES (${customerId}, ${amountInCents}, ${status}, ${date}, ${ownerId})
        `;
    } catch (error) {
        return {
            message: 'Database Error: Failed to Create Invoice.',
        };
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, ownerId: string, prevState: State, formData: FormData) {
    const validatedFields = UpdateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Invoice.',
        };
    }

    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;

    try {
        // First verify the invoice exists and belongs to the owner
        const verifyResult = await sql`
            SELECT id FROM invoices 
            WHERE id = ${id} AND owner_id = ${ownerId}
        `;

        if (verifyResult.rowCount === 0) {
            return {
                message: 'Invoice not found or access denied.',
            };
        }

        // Perform the update
        const result = await sql`
            UPDATE invoices
            SET 
                customer_id = ${customerId}, 
                amount = ${amountInCents}, 
                status = ${status}
            WHERE id = ${id} AND owner_id = ${ownerId}
            RETURNING *
        `;

        if (result.rowCount === 0) {
            return {
                message: 'Failed to update invoice. No rows affected.',
            };
        }
    } catch (error) {
        return {
            message: 'Database Error: Failed to Update Invoice.',
        };
    }

    // Revalidate all relevant paths
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/invoices');
    revalidatePath(`/dashboard/invoices/${id}`);
    revalidatePath(`/dashboard/invoices/${id}/edit`);
    
    // Force a hard navigation to ensure fresh data
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string, ownerId: string, formData: FormData) {
    try {
        await sql`DELETE FROM invoices WHERE id = ${id} AND owner_id = ${ownerId}`;
        revalidatePath('/dashboard/invoices');
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to delete invoice.');
    }
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signOut();
    } catch (error) {
        if ((error as Error).message.includes('NEXT_REDIRECT')) {
            throw error;
        }
        return 'Error: Failed to Sign Out';
    }
}

const DEFAULT_IMAGE_URL = 'https://example.com/placeholder.png';

const CustomerSchema = z.object({
    name: z.string({
        invalid_type_error: 'Please enter a name.',
    }).min(1, { message: 'Please enter a name.' }),
    email: z.string({
        invalid_type_error: 'Please enter an email.',
    }).email({ message: 'Please enter a valid email address.' }),
    image_url: z.string().nullable().transform(val => {
        if (!val || val === '') {
            return null;
        }
        return val;
    }),
});

export type CustomerState = {
    errors?: {
        name?: string[];
        email?: string[];
        image_url?: string[];
    };
    message?: string | null;
};

export async function createCustomer(ownerId: string, prevState: CustomerState, formData: FormData) {
    const validatedFields = CustomerSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        image_url: formData.get('image_url') || null,
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Customer.',
        };
    }

    const { name, email, image_url } = validatedFields.data;

    try {
        await sql`
            INSERT INTO customers (id, name, email, image_url, owner_id)
            VALUES (${crypto.randomUUID()}, ${name}, ${email}, ${image_url}, ${ownerId})
        `;
    } catch (error) {
        return {
            message: 'Database Error: Failed to Create Customer.',
        };
    }

    revalidatePath('/dashboard/customers');
    redirect('/dashboard/customers');
}

export async function updateCustomer(id: string, ownerId: string, prevState: CustomerState, formData: FormData) {
    const validatedFields = CustomerSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        image_url: formData.get('image_url') || null,
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Customer.',
        };
    }

    const { name, email, image_url } = validatedFields.data;

    try {
        const result = await sql`
            UPDATE customers
            SET name = ${name}, email = ${email}, image_url = ${image_url}
            WHERE id = ${id} AND owner_id = ${ownerId}
            RETURNING id
        `;

        // Check if the update affected any rows
        if (result.rowCount === 0) {
            return {
                message: 'Could not find customer to update.',
            };
        }
    } catch (error) {
        console.error('Failed to update customer:', error);
        return {
            message: 'Database Error: Failed to Update Customer.',
        };
    }

    revalidatePath('/dashboard/customers');
    redirect('/dashboard/customers');
}

export async function deleteCustomer(id: string, formData: FormData) {
    try {
        await sql`DELETE FROM customers WHERE id = ${id}`;
        revalidatePath('/dashboard/customers');
    } catch (error) {
        console.error('Failed to delete customer:', error);
        throw new Error('Failed to delete customer.');
    }
}