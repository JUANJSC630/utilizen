import AppLayout from '@/layouts/app-layout';
import AccountLayout from '@/layouts/account/layout';
import HeadingSmall from '@/components/heading-small';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Calendar, Check, Crown, Sparkles, Zap } from 'lucide-react';

interface Props {
    user: {
        id: number;
        name: string;
        is_premium: boolean;
        premium_expires_at: string | null;
        api_calls_count: number;
        api_calls_limit: number;
    };
    plans: {
        name: string;
        price: number;
        interval: 'monthly' | 'yearly';
        features: string[];
    }[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Account', href: '/account' },
    { title: 'Subscription', href: '/account/subscription' },
];

export default function AccountSubscription({ user, plans }: Props) {
    const usagePercentage = (user.api_calls_count / user.api_calls_limit) * 100;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Subscription" />
            <AccountLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Subscription"
                        description="Manage your subscription plan and usage limits."
                    />

                    {/* Current Plan */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {user.is_premium ? (
                                        <Crown className="h-5 w-5 text-yellow-500" />
                                    ) : (
                                        <Zap className="h-5 w-5 text-muted-foreground" />
                                    )}
                                    <CardTitle>Current Plan</CardTitle>
                                </div>
                                <Badge variant={user.is_premium ? 'default' : 'secondary'}>
                                    {user.is_premium ? 'Premium' : 'Free'}
                                </Badge>
                            </div>
                            <CardDescription>
                                {user.is_premium
                                    ? 'You have access to all premium features and higher usage limits.'
                                    : 'You are on the free plan with basic features.'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {user.is_premium && user.premium_expires_at && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span>
                                        Your subscription renews on{' '}
                                        {new Date(user.premium_expires_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </span>
                                </div>
                            )}

                            {/* Usage */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">API Calls This Month</span>
                                    <span className="font-medium">
                                        {user.api_calls_count} / {user.api_calls_limit}
                                    </span>
                                </div>
                                <Progress value={usagePercentage} className="h-2" />
                                {usagePercentage >= 80 && (
                                    <p className="text-xs text-amber-600">
                                        You're approaching your monthly limit. Consider upgrading for more calls.
                                    </p>
                                )}
                            </div>
                        </CardContent>
                        {user.is_premium && (
                            <CardFooter className="flex gap-3">
                                <Button variant="outline" asChild>
                                    <Link href="/account/billing">Manage Billing</Link>
                                </Button>
                                <Button variant="ghost" className="text-destructive hover:text-destructive">
                                    Cancel Subscription
                                </Button>
                            </CardFooter>
                        )}
                    </Card>

                    {/* Upgrade Section (show only for free users) */}
                    {!user.is_premium && (
                        <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-transparent">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-primary" />
                                    <CardTitle>Upgrade to Premium</CardTitle>
                                </div>
                                <CardDescription>
                                    Unlock all features and increase your usage limits.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {/* Monthly Plan */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">Monthly</CardTitle>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-3xl font-bold">$9</span>
                                                <span className="text-muted-foreground">/month</span>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="space-y-2 text-sm">
                                                <li className="flex items-center gap-2">
                                                    <Check className="h-4 w-4 text-green-500" />
                                                    Unlimited tool access
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <Check className="h-4 w-4 text-green-500" />
                                                    10,000 API calls/month
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <Check className="h-4 w-4 text-green-500" />
                                                    Priority support
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <Check className="h-4 w-4 text-green-500" />
                                                    No ads
                                                </li>
                                            </ul>
                                        </CardContent>
                                        <CardFooter>
                                            <Button className="w-full" asChild>
                                                <Link href="/pricing">Subscribe Monthly</Link>
                                            </Button>
                                        </CardFooter>
                                    </Card>

                                    {/* Yearly Plan */}
                                    <Card className="relative">
                                        <div className="absolute -top-3 right-4">
                                            <Badge className="bg-green-500">Save 20%</Badge>
                                        </div>
                                        <CardHeader>
                                            <CardTitle className="text-lg">Yearly</CardTitle>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-3xl font-bold">$86</span>
                                                <span className="text-muted-foreground">/year</span>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="space-y-2 text-sm">
                                                <li className="flex items-center gap-2">
                                                    <Check className="h-4 w-4 text-green-500" />
                                                    Everything in Monthly
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <Check className="h-4 w-4 text-green-500" />
                                                    2 months free
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <Check className="h-4 w-4 text-green-500" />
                                                    Early access to new tools
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <Check className="h-4 w-4 text-green-500" />
                                                    Custom integrations
                                                </li>
                                            </ul>
                                        </CardContent>
                                        <CardFooter>
                                            <Button className="w-full" variant="outline" asChild>
                                                <Link href="/pricing">Subscribe Yearly</Link>
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Plan Features */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Plan Features</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="grid gap-2 text-sm md:grid-cols-2">
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-500" />
                                    Access to all free tools
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-500" />
                                    {user.api_calls_limit} API calls per month
                                </li>
                                {user.is_premium && (
                                    <>
                                        <li className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-green-500" />
                                            Premium-only tools
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-green-500" />
                                            Priority support
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-green-500" />
                                            No advertisements
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-green-500" />
                                            Early access to new features
                                        </li>
                                    </>
                                )}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </AccountLayout>
        </AppLayout>
    );
}
