import AppLayout from '@/layouts/app-layout';
import AccountLayout from '@/layouts/account/layout';
import HeadingSmall from '@/components/heading-small';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { CreditCard, Download, Plus, Receipt } from 'lucide-react';

interface PaymentMethod {
    id: string;
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
    is_default: boolean;
}

interface Invoice {
    id: string;
    number: string;
    date: string;
    amount: number;
    status: 'paid' | 'pending' | 'failed';
    pdf_url: string | null;
}

interface Props {
    user: {
        id: number;
        name: string;
        is_premium: boolean;
    };
    paymentMethods: PaymentMethod[];
    invoices: Invoice[];
    billingAddress: {
        line1: string | null;
        line2: string | null;
        city: string | null;
        state: string | null;
        postal_code: string | null;
        country: string | null;
    } | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Account', href: '/account' },
    { title: 'Billing', href: '/account/billing' },
];

function getCardIcon(brand: string) {
    const brandLower = brand.toLowerCase();
    if (brandLower === 'visa') return '💳';
    if (brandLower === 'mastercard') return '💳';
    if (brandLower === 'amex') return '💳';
    return '💳';
}

function getStatusBadge(status: Invoice['status']) {
    switch (status) {
        case 'paid':
            return <Badge variant="default">Paid</Badge>;
        case 'pending':
            return <Badge variant="secondary">Pending</Badge>;
        case 'failed':
            return <Badge variant="destructive">Failed</Badge>;
    }
}

export default function AccountBilling({
    user,
    paymentMethods = [],
    invoices = [],
    billingAddress,
}: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Billing" />
            <AccountLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Billing"
                        description="Manage your payment methods and view your billing history."
                    />

                    {/* Payment Methods */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                                    <CardTitle>Payment Methods</CardTitle>
                                </div>
                                <Button size="sm" variant="outline">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Card
                                </Button>
                            </div>
                            <CardDescription>
                                Manage your payment methods for subscription billing.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {paymentMethods.length > 0 ? (
                                <div className="space-y-3">
                                    {paymentMethods.map((method) => (
                                        <div
                                            key={method.id}
                                            className="flex items-center justify-between rounded-lg border p-4"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">{getCardIcon(method.brand)}</span>
                                                <div>
                                                    <p className="font-medium">
                                                        {method.brand} ending in {method.last4}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Expires {method.exp_month}/{method.exp_year}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {method.is_default && (
                                                    <Badge variant="secondary">Default</Badge>
                                                )}
                                                <Button variant="ghost" size="sm">
                                                    Edit
                                                </Button>
                                                {!method.is_default && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-destructive hover:text-destructive"
                                                    >
                                                        Remove
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-8 text-center">
                                    <CreditCard className="mx-auto h-8 w-8 text-muted-foreground opacity-50" />
                                    <p className="mt-2 text-muted-foreground">
                                        No payment methods on file.
                                    </p>
                                    <Button className="mt-4" variant="outline">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Payment Method
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Billing Address */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Billing Address</CardTitle>
                                <Button size="sm" variant="outline">
                                    Edit
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {billingAddress && billingAddress.line1 ? (
                                <address className="not-italic text-sm text-muted-foreground">
                                    {billingAddress.line1}
                                    {billingAddress.line2 && <><br />{billingAddress.line2}</>}
                                    <br />
                                    {billingAddress.city}, {billingAddress.state} {billingAddress.postal_code}
                                    <br />
                                    {billingAddress.country}
                                </address>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    No billing address on file.
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Invoices */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Receipt className="h-5 w-5 text-muted-foreground" />
                                <CardTitle>Billing History</CardTitle>
                            </div>
                            <CardDescription>
                                View and download your past invoices.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {invoices.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Invoice</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {invoices.map((invoice) => (
                                            <TableRow key={invoice.id}>
                                                <TableCell className="font-medium">
                                                    {invoice.number}
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(invoice.date).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    ${(invoice.amount / 100).toFixed(2)}
                                                </TableCell>
                                                <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                                                <TableCell className="text-right">
                                                    {invoice.pdf_url && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            asChild
                                                        >
                                                            <a
                                                                href={invoice.pdf_url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <Download className="mr-2 h-4 w-4" />
                                                                PDF
                                                            </a>
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="py-8 text-center">
                                    <Receipt className="mx-auto h-8 w-8 text-muted-foreground opacity-50" />
                                    <p className="mt-2 text-muted-foreground">
                                        No invoices yet.
                                    </p>
                                    {!user.is_premium && (
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Invoices will appear here once you subscribe to a plan.
                                        </p>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </AccountLayout>
        </AppLayout>
    );
}
