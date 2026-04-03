<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Make email and password nullable so walk-in patients can be added without an account
        Schema::table('users', function (Blueprint $table) {
            $table->string('email')->nullable()->change();
            $table->string('password')->nullable()->change();
            // 'online' = registered via app; 'walkin' = added by staff without login credentials
            $table->enum('source', ['online', 'walkin'])->default('online')->after('role');
        });

        Schema::table('appointments', function (Blueprint $table) {
            // 'online' = patient booked via app; 'walkin' = created by staff for a walk-in visit
            $table->enum('source', ['online', 'walkin'])->default('walkin')->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('source');
            $table->string('email')->nullable(false)->change();
            $table->string('password')->nullable(false)->change();
        });

        Schema::table('appointments', function (Blueprint $table) {
            $table->dropColumn('source');
        });
    }
};
