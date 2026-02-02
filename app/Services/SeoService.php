<?php

namespace App\Services;

use App\Models\Tool;
use Artesaos\SEOTools\Facades\JsonLdMulti;
use Artesaos\SEOTools\Facades\OpenGraph;
use Artesaos\SEOTools\Facades\SEOMeta;
use Artesaos\SEOTools\Facades\TwitterCard;

class SeoService
{
    public function setDefaults(): void
    {
        SEOMeta::setTitle(config('seotools.meta.defaults.title'));
        SEOMeta::setDescription(config('seotools.meta.defaults.description'));
        SEOMeta::setCanonical(url()->current());
        SEOMeta::addKeyword(config('seotools.meta.defaults.keywords'));

        OpenGraph::setTitle(config('seotools.meta.defaults.title'));
        OpenGraph::setDescription(config('seotools.meta.defaults.description'));
        OpenGraph::setUrl(url()->current());
        OpenGraph::setType('website');
        OpenGraph::setSiteName(config('seotools.opengraph.defaults.site_name'));
        OpenGraph::addImage(config('seotools.meta.defaults.image'));

        TwitterCard::setType('summary_large_image');
        TwitterCard::setTitle(config('seotools.meta.defaults.title'));
        TwitterCard::setDescription(config('seotools.meta.defaults.description'));
        TwitterCard::setImage(config('seotools.meta.defaults.image'));

        JsonLdMulti::setType('Organization');
        JsonLdMulti::setTitle(config('app.name'));
        JsonLdMulti::setDescription(config('seotools.meta.defaults.description'));
        JsonLdMulti::setUrl(config('app.url'));
        JsonLdMulti::addValue('logo', config('seotools.meta.defaults.image'));
    }

    public function setHomePage(): void
    {
        $title = 'UtiliZen - Professional Developer Tools';
        $description = 'Professional online tools for web developers. Create React components, validate props, analyze performance, and more.';

        SEOMeta::setTitle($title);
        SEOMeta::setDescription($description);
        SEOMeta::setCanonical(route('home'));

        OpenGraph::setTitle($title);
        OpenGraph::setDescription($description);
        OpenGraph::setUrl(route('home'));
        OpenGraph::setType('website');
        OpenGraph::setSiteName(config('seotools.opengraph.defaults.site_name'));
        OpenGraph::addImage(config('seotools.meta.defaults.image'));

        TwitterCard::setType('summary_large_image');
        TwitterCard::setTitle($title);
        TwitterCard::setDescription($description);
        TwitterCard::setImage(config('seotools.meta.defaults.image'));

        JsonLdMulti::newJsonLd();
        JsonLdMulti::setType('WebSite');
        JsonLdMulti::setTitle('UtiliZen');
        JsonLdMulti::setUrl(config('app.url'));
        JsonLdMulti::addValue('potentialAction', [
            '@type' => 'SearchAction',
            'target' => config('app.url').'/tools?search={search_term_string}',
            'query-input' => 'required name=search_term_string',
        ]);
    }

    public function setToolsIndex(): void
    {
        $title = 'Developer Tools - UtiliZen';
        $description = 'Browse our collection of professional developer tools. React component generators, validators, analyzers, and more.';

        SEOMeta::setTitle($title);
        SEOMeta::setDescription($description);
        SEOMeta::setCanonical(route('tools.index'));

        OpenGraph::setTitle($title);
        OpenGraph::setDescription($description);
        OpenGraph::setUrl(route('tools.index'));
        OpenGraph::setType('website');
        OpenGraph::setSiteName(config('seotools.opengraph.defaults.site_name'));
        OpenGraph::addImage(config('seotools.meta.defaults.image'));

        TwitterCard::setType('summary_large_image');
        TwitterCard::setTitle($title);
        TwitterCard::setDescription($description);
        TwitterCard::setImage(config('seotools.meta.defaults.image'));

        JsonLdMulti::newJsonLd();
        JsonLdMulti::setType('CollectionPage');
        JsonLdMulti::setTitle($title);
        JsonLdMulti::setDescription($description);
        JsonLdMulti::setUrl(route('tools.index'));
    }

    public function setToolPage(Tool $tool): void
    {
        $title = $tool->meta_title ?? "{$tool->name} - UtiliZen";
        $description = $tool->meta_description ?? $tool->description;

        SEOMeta::setTitle($title);
        SEOMeta::setDescription($description);
        SEOMeta::setCanonical(route('tools.show', $tool->slug));

        if ($tool->keywords) {
            SEOMeta::addKeyword($tool->keywords);
        }

        OpenGraph::setTitle($title);
        OpenGraph::setDescription($description);
        OpenGraph::setUrl(route('tools.show', $tool->slug));
        OpenGraph::setType('website');
        OpenGraph::setSiteName(config('seotools.opengraph.defaults.site_name'));
        OpenGraph::addImage(config('seotools.meta.defaults.image'));

        TwitterCard::setType('summary_large_image');
        TwitterCard::setTitle($title);
        TwitterCard::setDescription($description);
        TwitterCard::setImage(config('seotools.meta.defaults.image'));

        JsonLdMulti::newJsonLd();
        JsonLdMulti::setType('SoftwareApplication');
        JsonLdMulti::setTitle($tool->name);
        JsonLdMulti::setDescription($tool->description);
        JsonLdMulti::addValue('applicationCategory', 'DeveloperApplication');
        JsonLdMulti::addValue('operatingSystem', 'Web');
        JsonLdMulti::addValue('offers', [
            '@type' => 'Offer',
            'price' => $tool->is_premium ? '9.00' : '0',
            'priceCurrency' => 'USD',
        ]);
    }

    public function setStaticPage(string $title, string $description): void
    {
        SEOMeta::setTitle($title);
        SEOMeta::setDescription($description);
        SEOMeta::setCanonical(url()->current());

        OpenGraph::setTitle($title);
        OpenGraph::setDescription($description);
        OpenGraph::setUrl(url()->current());
        OpenGraph::setType('website');
        OpenGraph::setSiteName(config('seotools.opengraph.defaults.site_name'));
        OpenGraph::addImage(config('seotools.meta.defaults.image'));

        TwitterCard::setType('summary_large_image');
        TwitterCard::setTitle($title);
        TwitterCard::setDescription($description);
        TwitterCard::setImage(config('seotools.meta.defaults.image'));
    }

    public function setNoIndex(): void
    {
        SEOMeta::addMeta('robots', 'noindex,nofollow');
    }
}
