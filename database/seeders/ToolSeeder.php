<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ToolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tools = [
            [
                'name' => 'React Component Generator',
                'slug' => 'react-component-generator',
                'description' => 'Generate React functional or class components with hooks, props, TypeScript, and tests following best practices.',
                'component_name' => 'ReactComponentGenerator',
                'category' => 'code-generation',
                'is_active' => true,
                'is_premium' => false,
                'meta_title' => 'React Component Generator - Free Online Tool',
                'meta_description' => 'Generate React components instantly with hooks, TypeScript, and tests. Free online tool for React developers.',
                'keywords' => 'react component generator, react hooks, typescript, jsx, functional components',
            ],
            [
                'name' => 'Props Validator',
                'slug' => 'react-props-validator',
                'description' => 'Validate React PropTypes, detect unused props, and get TypeScript interface suggestions automatically.',
                'component_name' => 'PropsValidator',
                'category' => 'validation',
                'is_active' => true,
                'is_premium' => false,
                'meta_title' => 'React Props Validator - Check PropTypes Online',
                'meta_description' => 'Validate React props, detect unused PropTypes, and generate TypeScript interfaces. Free validation tool.',
                'keywords' => 'react props validation, proptypes, typescript interface, react validation',
            ],
            [
                'name' => 'Performance Analyzer',
                'slug' => 'react-performance-analyzer',
                'description' => 'Analyze React components for performance issues, detect unnecessary re-renders, and get optimization suggestions.',
                'component_name' => 'PerformanceAnalyzer',
                'category' => 'optimization',
                'is_active' => true,
                'is_premium' => false,
                'meta_title' => 'React Performance Analyzer - Optimize Components',
                'meta_description' => 'Analyze React performance issues and get optimization suggestions. Free tool for React developers.',
                'keywords' => 'react performance, optimization, re-renders, useMemo, useCallback',
            ],
            [
                'name' => 'JSX to HTML Converter',
                'slug' => 'jsx-to-html-converter',
                'description' => 'Convert JSX code to standard HTML instantly. Transforms className, styles, and React-specific syntax.',
                'component_name' => 'JsxToHtmlConverter',
                'category' => 'conversion',
                'is_active' => true,
                'is_premium' => false,
                'meta_title' => 'JSX to HTML Converter - Free Online Tool',
                'meta_description' => 'Convert JSX to HTML instantly. Transform React code to standard HTML with proper attributes.',
                'keywords' => 'jsx to html, jsx converter, react to html, jsx html conversion',
            ],
            [
                'name' => 'State Management Selector',
                'slug' => 'react-state-management-selector',
                'description' => 'Interactive quiz to help you choose the right state management solution for your React app (Redux, Zustand, Context, Jotai).',
                'component_name' => 'StateManagementSelector',
                'category' => 'guidance',
                'is_active' => true,
                'is_premium' => false,
                'meta_title' => 'React State Management Selector - Choose the Right Tool',
                'meta_description' => 'Find the perfect state management solution for your React app. Compare Redux, Zustand, Context API, and more.',
                'keywords' => 'react state management, redux, zustand, context api, jotai, recoil',
            ],
        ];

        foreach ($tools as $tool) {
            \App\Models\Tool::create($tool);
        }
    }
}
