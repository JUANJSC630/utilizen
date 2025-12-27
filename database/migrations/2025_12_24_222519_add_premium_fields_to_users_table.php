<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_premium')->default(false)->after('email');
            $table->timestamp('premium_expires_at')->nullable()->after('is_premium');
            $table->integer('api_calls_count')->default(0)->after('premium_expires_at');
            $table->integer('api_calls_limit')->default(100)->after('api_calls_count');

            $table->index('is_premium');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['is_premium']);
            $table->dropColumn(['is_premium', 'premium_expires_at', 'api_calls_count', 'api_calls_limit']);
        });
    }
};
