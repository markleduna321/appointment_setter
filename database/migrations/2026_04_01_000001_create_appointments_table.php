<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();

            // The patient who owns this booking
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->cascadeOnDelete();

            // Appointment details
            $table->string('service');
            $table->string('doctor_name');
            $table->date('date');
            $table->time('time');
            $table->text('notes')->nullable();

            // Status lifecycle: pending → confirmed → completed | cancelled
            $table->enum('status', ['pending', 'confirmed', 'completed', 'cancelled'])
                  ->default('pending');

            // Who last updated the status (nullable — system/patient may change it)
            $table->foreignId('updated_by')
                  ->nullable()
                  ->constrained('users')
                  ->nullOnDelete();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
