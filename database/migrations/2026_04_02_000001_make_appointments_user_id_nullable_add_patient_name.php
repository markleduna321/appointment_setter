<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            // Drop the existing NOT NULL foreign key constraint first
            $table->dropForeign(['user_id']);

            // Make user_id nullable (manual appointments have no user account)
            $table->foreignId('user_id')
                  ->nullable()
                  ->change();

            // Re-add the foreign key as nullable
            $table->foreign('user_id')
                  ->references('id')
                  ->on('users')
                  ->cascadeOnDelete();

            // Free-text patient name for walk-in / phone-in bookings
            $table->string('patient_name')->nullable()->after('user_id');
        });
    }

    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropColumn('patient_name');

            $table->dropForeign(['user_id']);
            $table->foreignId('user_id')
                  ->nullable(false)
                  ->change();
            $table->foreign('user_id')
                  ->references('id')
                  ->on('users')
                  ->cascadeOnDelete();
        });
    }
};
