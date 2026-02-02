import AppLayout from '@/layouts/app-layout';
import AccountLayout from '@/layouts/account/layout';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAppearance } from '@/hooks/use-appearance';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import { Bell, Globe, Monitor, Moon, Palette, Sun } from 'lucide-react';

interface Preferences {
    language: string;
    timezone: string;
    email_notifications: boolean;
    marketing_emails: boolean;
    product_updates: boolean;
}

interface Props {
    preferences: Preferences;
    timezones: string[];
    languages: { code: string; name: string }[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Account', href: '/account' },
    { title: 'Preferences', href: '/account/preferences' },
];

export default function AccountPreferences({
    preferences,
    timezones = ['UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Asia/Tokyo'],
    languages = [
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Spanish' },
    ],
}: Props) {
    const { appearance, updateAppearance } = useAppearance();

    const { data, setData, patch, processing, recentlySuccessful } = useForm({
        language: preferences.language || 'en',
        timezone: preferences.timezone || 'UTC',
        email_notifications: preferences.email_notifications ?? true,
        marketing_emails: preferences.marketing_emails ?? false,
        product_updates: preferences.product_updates ?? true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch('/account/preferences', {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Preferences" />
            <AccountLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Preferences"
                        description="Customize your experience and notification settings."
                    />

                    <form onSubmit={submit} className="space-y-6">
                        {/* Appearance */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Palette className="h-5 w-5 text-muted-foreground" />
                                    <CardTitle>Appearance</CardTitle>
                                </div>
                                <CardDescription>
                                    Customize how UtiliZen looks on your device.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Theme</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Select your preferred color scheme.
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant={appearance === 'light' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => updateAppearance('light')}
                                        >
                                            <Sun className="mr-2 h-4 w-4" />
                                            Light
                                        </Button>
                                        <Button
                                            type="button"
                                            variant={appearance === 'dark' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => updateAppearance('dark')}
                                        >
                                            <Moon className="mr-2 h-4 w-4" />
                                            Dark
                                        </Button>
                                        <Button
                                            type="button"
                                            variant={appearance === 'system' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => updateAppearance('system')}
                                        >
                                            <Monitor className="mr-2 h-4 w-4" />
                                            System
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Localization */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Globe className="h-5 w-5 text-muted-foreground" />
                                    <CardTitle>Localization</CardTitle>
                                </div>
                                <CardDescription>
                                    Configure language and regional settings.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="language">Language</Label>
                                        <Select
                                            value={data.language}
                                            onValueChange={(v) => setData('language', v)}
                                        >
                                            <SelectTrigger id="language">
                                                <SelectValue placeholder="Select language" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {languages.map((lang) => (
                                                    <SelectItem key={lang.code} value={lang.code}>
                                                        {lang.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="timezone">Timezone</Label>
                                        <Select
                                            value={data.timezone}
                                            onValueChange={(v) => setData('timezone', v)}
                                        >
                                            <SelectTrigger id="timezone">
                                                <SelectValue placeholder="Select timezone" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {timezones.map((tz) => (
                                                    <SelectItem key={tz} value={tz}>
                                                        {tz.replace('_', ' ')}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Notifications */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Bell className="h-5 w-5 text-muted-foreground" />
                                    <CardTitle>Email Notifications</CardTitle>
                                </div>
                                <CardDescription>
                                    Manage your email notification preferences.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="email_notifications">
                                            Email Notifications
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            Receive important account notifications via email.
                                        </p>
                                    </div>
                                    <Switch
                                        id="email_notifications"
                                        checked={data.email_notifications}
                                        onCheckedChange={(checked) =>
                                            setData('email_notifications', checked)
                                        }
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="product_updates">Product Updates</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Get notified about new features and improvements.
                                        </p>
                                    </div>
                                    <Switch
                                        id="product_updates"
                                        checked={data.product_updates}
                                        onCheckedChange={(checked) =>
                                            setData('product_updates', checked)
                                        }
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="marketing_emails">Marketing Emails</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Receive tips, offers, and news about UtiliZen.
                                        </p>
                                    </div>
                                    <Switch
                                        id="marketing_emails"
                                        checked={data.marketing_emails}
                                        onCheckedChange={(checked) =>
                                            setData('marketing_emails', checked)
                                        }
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Save Button */}
                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={processing}>
                                Save Preferences
                            </Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-green-600">Saved.</p>
                            </Transition>
                        </div>
                    </form>
                </div>
            </AccountLayout>
        </AppLayout>
    );
}
