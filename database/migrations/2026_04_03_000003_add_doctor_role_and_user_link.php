<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Add 'doctor' to the users role enum
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('super_admin','admin','appointment_setter','patient','doctor') DEFAULT 'patient'");

        // 2. Add user_id FK to doctors (nullable — existing doctors have no user account)
        Schema::table('doctors', function (Blueprint $table) {
            $table->foreignId('user_id')
                  ->nullable()
                  ->after('id')
                  ->constrained('users')
                  ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('doctors', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });

        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('super_admin','admin','appointment_setter','patient') DEFAULT 'patient'");
    }
};
