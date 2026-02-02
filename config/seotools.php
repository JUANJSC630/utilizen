<?php

/**
 * SEO Tools Configuration
 *
 * @see https://github.com/artesaos/seotools
 */

return [
    'inertia' => env('SEO_TOOLS_INERTIA', false),
    'meta' => [
        /*
         * The default configurations to be used by the meta generator.
         */
        'defaults' => [
            'title' => env('SEO_DEFAULT_TITLE', 'UtiliZen - Professional Developer Tools'),
            'titleBefore' => false,
            'description' => env('SEO_DEFAULT_DESCRIPTION', 'Professional online tools for web developers. Create React components, validate props, and more.'),
            'separator' => ' - ',
            'keywords' => ['react tools', 'developer tools', 'component generator', 'web development'],
            'canonical' => 'current',
            'robots' => false,
            'image' => env('SEO_DEFAULT_IMAGE', env('APP_URL').'/og-image.png'),
        ],
        /*
         * Webmaster tags are always added.
         */
        'webmaster_tags' => [
            'google' => env('GOOGLE_SEARCH_CONSOLE_VERIFICATION'),
            'bing' => null,
            'alexa' => null,
            'pinterest' => null,
            'yandex' => null,
            'norton' => null,
        ],

        'add_notranslate_class' => false,
    ],
    'opengraph' => [
        /*
         * The default configurations to be used by the opengraph generator.
         */
        'defaults' => [
            'title' => env('SEO_DEFAULT_TITLE', 'UtiliZen - Professional Developer Tools'),
            'description' => env('SEO_DEFAULT_DESCRIPTION', 'Professional online tools for web developers. Create React components, validate props, and more.'),
            'url' => null,
            'type' => 'website',
            'site_name' => env('SEO_SITE_NAME', 'UtiliZen'),
            'images' => [],
        ],
    ],
    'twitter' => [
        /*
         * The default values to be used by the twitter cards generator.
         */
        'defaults' => [
            'card' => 'summary_large_image',
        ],
    ],
    'json-ld' => [
        /*
         * The default configurations to be used by the json-ld generator.
         */
        'defaults' => [
            'title' => env('SEO_DEFAULT_TITLE', 'UtiliZen - Professional Developer Tools'),
            'description' => env('SEO_DEFAULT_DESCRIPTION', 'Professional online tools for web developers. Create React components, validate props, and more.'),
            'url' => null,
            'type' => 'WebPage',
            'images' => [],
        ],
    ],
];
