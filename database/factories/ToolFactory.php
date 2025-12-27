<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Tool>
 */
class ToolFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->words(3, true);

        return [
            'name' => ucwords($name),
            'slug' => str($name)->slug()->toString(),
            'description' => fake()->sentence(12),
            'component_name' => str($name)->studly()->toString(),
            'category' => fake()->randomElement(['code-generation', 'validation', 'optimization', 'conversion', 'guidance']),
            'is_active' => true,
            'is_premium' => false,
            'usage_count' => 0,
            'view_count' => 0,
            'meta_title' => ucwords($name).' - UtiliZen',
            'meta_description' => fake()->sentence(15),
            'keywords' => implode(', ', fake()->words(5)),
        ];
    }

    /**
     * Indicate that the tool is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Indicate that the tool is premium.
     */
    public function premium(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_premium' => true,
        ]);
    }

    /**
     * Indicate that the tool has been used.
     */
    public function withUsage(): static
    {
        return $this->state(fn (array $attributes) => [
            'usage_count' => fake()->numberBetween(10, 1000),
            'view_count' => fake()->numberBetween(50, 5000),
        ]);
    }
}
