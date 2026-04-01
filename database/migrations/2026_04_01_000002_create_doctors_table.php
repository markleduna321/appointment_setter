<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('doctors', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('specialty');
            $table->string('email')->unique()->nullable();
            $table->string('phone')->nullable();
            $table->text('bio')->nullable();
            $table->string('photo')->nullable();         // URL or path
            $table->enum('status', ['available', 'unavailable', 'on_leave'])->default('available');
            $table->time('schedule_start')->nullable();  // e.g. 08:00
            $table->time('schedule_end')->nullable();    // e.g. 17:00
            $table->json('schedule_days')->nullable();   // ["Mon","Tue","Wed","Thu","Fri"]
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('doctors');
    }
};
