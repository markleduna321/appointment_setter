<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ----------------------------------------------------------------
        // Main visit / checkup record
        // ----------------------------------------------------------------
        Schema::create('patient_records', function (Blueprint $table) {
            $table->id();

            // Patient this record belongs to
            $table->foreignId('patient_id')
                  ->constrained('users')
                  ->cascadeOnDelete();

            // Optionally linked to a scheduled appointment
            $table->foreignId('appointment_id')
                  ->nullable()
                  ->constrained('appointments')
                  ->nullOnDelete();

            // Attending doctor (nullable — walk-ins may not have a pre-assigned doctor)
            $table->foreignId('doctor_id')
                  ->nullable()
                  ->constrained('doctors')
                  ->nullOnDelete();

            $table->dateTime('visited_at');               // Actual date & time of the checkup

            // Clinical narrative
            $table->text('chief_complaint')->nullable();  // Patient's presenting complaint
            $table->text('diagnosis')->nullable();        // Doctor's diagnosis
            $table->text('notes')->nullable();            // General clinical notes / follow-up plan

            // Vitals
            $table->string('blood_pressure', 10)->nullable(); // e.g. "120/80"
            $table->unsignedSmallInteger('heart_rate')->nullable();      // bpm
            $table->decimal('temperature', 4, 1)->nullable();            // °C
            $table->decimal('weight', 5, 2)->nullable();                 // kg
            $table->decimal('height', 5, 2)->nullable();                 // cm
            $table->unsignedTinyInteger('oxygen_saturation')->nullable(); // %

            // Staff who created this record
            $table->foreignId('created_by')
                  ->nullable()
                  ->constrained('users')
                  ->nullOnDelete();

            $table->timestamps();
        });

        // ----------------------------------------------------------------
        // Prescribed medications for a visit
        // ----------------------------------------------------------------
        Schema::create('patient_record_medications', function (Blueprint $table) {
            $table->id();

            $table->foreignId('patient_record_id')
                  ->constrained('patient_records')
                  ->cascadeOnDelete();

            $table->string('name');                        // Drug / medicine name
            $table->string('dosage')->nullable();          // e.g. "500 mg"
            $table->string('frequency')->nullable();       // e.g. "twice daily"
            $table->string('duration')->nullable();        // e.g. "7 days"
            $table->text('instructions')->nullable();      // Special intake instructions

            $table->timestamps();
        });

        // ----------------------------------------------------------------
        // Laboratory test results (blood work, urinalysis, etc.)
        // ----------------------------------------------------------------
        Schema::create('patient_record_lab_results', function (Blueprint $table) {
            $table->id();

            $table->foreignId('patient_record_id')
                  ->constrained('patient_records')
                  ->cascadeOnDelete();

            $table->string('test_name');                   // e.g. "CBC", "Blood Glucose"
            $table->string('result');                      // Measured value
            $table->string('unit')->nullable();            // e.g. "mg/dL", "g/dL"
            $table->string('reference_range')->nullable(); // e.g. "70–100 mg/dL"
            $table->enum('status', ['normal', 'abnormal', 'critical'])->nullable();
            $table->text('remarks')->nullable();
            $table->date('tested_at')->nullable();

            $table->timestamps();
        });

        // ----------------------------------------------------------------
        // Diagnostic / imaging test results (X-Ray, MRI, ECG, ultrasound…)
        // ----------------------------------------------------------------
        Schema::create('patient_record_test_results', function (Blueprint $table) {
            $table->id();

            $table->foreignId('patient_record_id')
                  ->constrained('patient_records')
                  ->cascadeOnDelete();

            $table->string('type');                        // e.g. "X-Ray", "MRI", "ECG", "Ultrasound"
            $table->string('description')->nullable();     // Brief label / body part
            $table->text('findings')->nullable();          // Radiologist / technician findings
            $table->string('file_path')->nullable();       // Stored image/PDF path
            $table->date('conducted_at')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('patient_record_test_results');
        Schema::dropIfExists('patient_record_lab_results');
        Schema::dropIfExists('patient_record_medications');
        Schema::dropIfExists('patient_records');
    }
};
