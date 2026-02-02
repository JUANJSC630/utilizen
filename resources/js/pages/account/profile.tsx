import AppLayout from '@/layouts/app-layout';
import AccountLayout from '@/layouts/account/layout';
import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { type FormEventHandler } from 'react';

interface Props {
    mustVerifyEmail: boolean;
    status?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Account', href: '/account' },
    { title: 'Profile', href: '/account/profile' },
];

export default function AccountProfile({ mustVerifyEmail, status }: Props) {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user!;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch('/account/profile', {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile" />
            <AccountLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Profile Information"
                        description="Update your account's profile information and email address."
                    />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                required
                                autoComplete="name"
                                placeholder="Full name"
                            />
                            <InputError className="mt-2" message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                required
                                autoComplete="username"
                                placeholder="Email address"
                            />
                            <InputError className="mt-2" message={errors.email} />
                        </div>

                        {mustVerifyEmail && user.email_verified_at === null && (
                            <div>
                                <p className="mt-2 text-sm text-foreground">
                                    Your email address is unverified.{' '}
                                    <Link
                                        href="/email/verification-notification"
                                        method="post"
                                        as="button"
                                        className="text-muted-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:text-foreground! hover:decoration-current dark:decoration-neutral-500"
                                    >
                                        Click here to re-send the verification
                                        email.
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        A new verification link has been sent to
                                        your email address.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Save</Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">
                                    Saved.
                                </p>
                            </Transition>
                        </div>
                    </form>

                    <DeleteUser />
                </div>
            </AccountLayout>
        </AppLayout>
    );
}
