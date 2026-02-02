import AppLayout from '@/layouts/app-layout';
import AccountLayout from '@/layouts/account/layout';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head } from '@inertiajs/react';
import { Key, ShieldBan, ShieldCheck, Smartphone } from 'lucide-react';
import { useRef, useState } from 'react';
import { disable, enable } from '@/routes/two-factor';
import { update as passwordUpdate } from '@/actions/App/Http/Controllers/Settings/PasswordController';

interface Props {
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Account', href: '/account' },
    { title: 'Security', href: '/account/security' },
];

export default function AccountSecurity({
    requiresConfirmation = false,
    twoFactorEnabled = false,
}: Props) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        qrCodeSvg,
        hasSetupData,
        manualSetupKey,
        clearSetupData,
        fetchSetupData,
        recoveryCodesList,
        fetchRecoveryCodes,
        errors: twoFactorErrors,
    } = useTwoFactorAuth();
    const [showSetupModal, setShowSetupModal] = useState<boolean>(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Security" />
            <AccountLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Security Settings"
                        description="Manage your password and two-factor authentication to keep your account secure."
                    />

                    {/* Password Section */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Key className="h-5 w-5 text-muted-foreground" />
                                <CardTitle>Password</CardTitle>
                            </div>
                            <CardDescription>
                                Ensure your account is using a long, random password to stay secure.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form
                                {...passwordUpdate['/account/security/password'].form()}
                                options={{
                                    preserveScroll: true,
                                }}
                                resetOnError={[
                                    'password',
                                    'password_confirmation',
                                    'current_password',
                                ]}
                                resetOnSuccess
                                onError={(errors) => {
                                    if (errors.password) {
                                        passwordInput.current?.focus();
                                    }
                                    if (errors.current_password) {
                                        currentPasswordInput.current?.focus();
                                    }
                                }}
                                className="space-y-4"
                            >
                                {({ errors, processing, recentlySuccessful }) => (
                                    <>
                                        <div className="grid gap-2">
                                            <Label htmlFor="current_password">
                                                Current password
                                            </Label>
                                            <Input
                                                id="current_password"
                                                ref={currentPasswordInput}
                                                name="current_password"
                                                type="password"
                                                className="max-w-md"
                                                autoComplete="current-password"
                                                placeholder="Current password"
                                            />
                                            <InputError message={errors.current_password} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="password">New password</Label>
                                            <Input
                                                id="password"
                                                ref={passwordInput}
                                                name="password"
                                                type="password"
                                                className="max-w-md"
                                                autoComplete="new-password"
                                                placeholder="New password"
                                            />
                                            <InputError message={errors.password} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="password_confirmation">
                                                Confirm password
                                            </Label>
                                            <Input
                                                id="password_confirmation"
                                                name="password_confirmation"
                                                type="password"
                                                className="max-w-md"
                                                autoComplete="new-password"
                                                placeholder="Confirm password"
                                            />
                                            <InputError message={errors.password_confirmation} />
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <Button disabled={processing}>
                                                Update Password
                                            </Button>

                                            <Transition
                                                show={recentlySuccessful}
                                                enter="transition ease-in-out"
                                                enterFrom="opacity-0"
                                                leave="transition ease-in-out"
                                                leaveTo="opacity-0"
                                            >
                                                <p className="text-sm text-green-600">
                                                    Password updated.
                                                </p>
                                            </Transition>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </CardContent>
                    </Card>

                    <Separator />

                    {/* Two-Factor Authentication Section */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                                    <CardTitle>Two-Factor Authentication</CardTitle>
                                </div>
                                <Badge variant={twoFactorEnabled ? 'default' : 'destructive'}>
                                    {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                                </Badge>
                            </div>
                            <CardDescription>
                                Add additional security to your account using two-factor authentication.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {twoFactorEnabled ? (
                                <div className="space-y-4">
                                    <p className="text-sm text-muted-foreground">
                                        Two-factor authentication is enabled. You will be prompted for a
                                        secure, random pin during login, which you can retrieve from a
                                        TOTP-supported application on your phone.
                                    </p>

                                    <TwoFactorRecoveryCodes
                                        recoveryCodesList={recoveryCodesList}
                                        fetchRecoveryCodes={fetchRecoveryCodes}
                                        errors={twoFactorErrors}
                                    />

                                    <Form {...disable.form()}>
                                        {({ processing }) => (
                                            <Button
                                                variant="destructive"
                                                type="submit"
                                                disabled={processing}
                                            >
                                                <ShieldBan className="mr-2 h-4 w-4" />
                                                Disable 2FA
                                            </Button>
                                        )}
                                    </Form>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <p className="text-sm text-muted-foreground">
                                        When you enable two-factor authentication, you will be prompted
                                        for a secure pin during login. This pin can be retrieved from a
                                        TOTP-supported application on your phone like Google Authenticator
                                        or Authy.
                                    </p>

                                    {hasSetupData ? (
                                        <Button onClick={() => setShowSetupModal(true)}>
                                            <ShieldCheck className="mr-2 h-4 w-4" />
                                            Continue Setup
                                        </Button>
                                    ) : (
                                        <Form
                                            {...enable.form()}
                                            onSuccess={() => setShowSetupModal(true)}
                                        >
                                            {({ processing }) => (
                                                <Button type="submit" disabled={processing}>
                                                    <ShieldCheck className="mr-2 h-4 w-4" />
                                                    Enable 2FA
                                                </Button>
                                            )}
                                        </Form>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <TwoFactorSetupModal
                        isOpen={showSetupModal}
                        onClose={() => setShowSetupModal(false)}
                        requiresConfirmation={requiresConfirmation}
                        twoFactorEnabled={twoFactorEnabled}
                        qrCodeSvg={qrCodeSvg}
                        manualSetupKey={manualSetupKey}
                        clearSetupData={clearSetupData}
                        fetchSetupData={fetchSetupData}
                        errors={twoFactorErrors}
                    />
                </div>
            </AccountLayout>
        </AppLayout>
    );
}
