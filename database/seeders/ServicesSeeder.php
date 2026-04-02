<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServicesSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            // General Practice
            ['name' => 'General Consultation',       'category' => 'General Practice', 'duration' => 30,  'price' => 500.00,  'description' => 'General medical consultation for common illnesses and health concerns.'],
            ['name' => 'Annual Physical Examination', 'category' => 'General Practice', 'duration' => 60,  'price' => 1200.00, 'description' => 'Comprehensive head-to-toe physical examination with health assessment.'],

            // Dental
            ['name' => 'Dental Checkup & Cleaning',  'category' => 'Dental',           'duration' => 45,  'price' => 800.00,  'description' => 'Routine dental examination with professional teeth cleaning.'],
            ['name' => 'Tooth Extraction',            'category' => 'Dental',           'duration' => 30,  'price' => 1500.00, 'description' => 'Safe removal of damaged or problematic teeth.'],
            ['name' => 'Dental Filling',              'category' => 'Dental',           'duration' => 45,  'price' => 1200.00, 'description' => 'Tooth restoration using composite or amalgam filling material.'],

            // Cardiology
            ['name' => 'Cardiac Consultation',        'category' => 'Cardiology',       'duration' => 45,  'price' => 1500.00, 'description' => 'Heart health evaluation by a licensed cardiologist.'],
            ['name' => 'ECG / EKG',                   'category' => 'Cardiology',       'duration' => 30,  'price' => 800.00,  'description' => 'Electrocardiogram test to monitor heart electrical activity.'],

            // Pediatrics
            ['name' => 'Pediatric Consultation',      'category' => 'Pediatrics',       'duration' => 30,  'price' => 600.00,  'description' => "Medical consultation specialized for infants, children, and adolescents."],
            ['name' => 'Well Baby Checkup',           'category' => 'Pediatrics',       'duration' => 30,  'price' => 700.00,  'description' => 'Routine health monitoring for newborns and young children.'],

            // Dermatology
            ['name' => 'Skin Consultation',           'category' => 'Dermatology',      'duration' => 30,  'price' => 1000.00, 'description' => 'Dermatological evaluation for skin, hair, and nail conditions.'],
            ['name' => 'Acne Treatment Session',      'category' => 'Dermatology',      'duration' => 45,  'price' => 1500.00, 'description' => 'Targeted acne treatment including extraction and topical therapy.'],

            // OB-GYN
            ['name' => 'OB-GYN Consultation',         'category' => 'OB-GYN',          'duration' => 30,  'price' => 1000.00, 'description' => "Obstetric and gynecological consultation for women's health."],
            ['name' => 'Prenatal Checkup',            'category' => 'OB-GYN',          'duration' => 45,  'price' => 1200.00, 'description' => 'Comprehensive prenatal checkup to monitor maternal and fetal health.'],

            // Orthopedics
            ['name' => 'Orthopedic Consultation',     'category' => 'Orthopedics',      'duration' => 30,  'price' => 1200.00, 'description' => 'Consultation for bone, joint, and musculoskeletal conditions.'],
            ['name' => 'Joint Pain Assessment',       'category' => 'Orthopedics',      'duration' => 30,  'price' => 1000.00, 'description' => 'Evaluation and diagnostic assessment of joint pain and mobility issues.'],

            // Eye Care
            ['name' => 'Eye Examination',             'category' => 'Eye Care',         'duration' => 30,  'price' => 700.00,  'description' => 'Complete eye health and vision examination.'],
            ['name' => 'Vision Test & Prescription',  'category' => 'Eye Care',         'duration' => 20,  'price' => 500.00,  'description' => 'Refraction test to determine corrective lens prescription.'],

            // Vaccination
            ['name' => 'Flu Vaccine',                 'category' => 'Vaccination',      'duration' => 15,  'price' => 600.00,  'description' => 'Annual influenza vaccination for adults and children.'],
            ['name' => 'COVID-19 Booster',            'category' => 'Vaccination',      'duration' => 20,  'price' => 500.00,  'description' => 'COVID-19 booster shot to maintain immunity.'],
            ['name' => 'Hepatitis B Vaccine',         'category' => 'Vaccination',      'duration' => 15,  'price' => 750.00,  'description' => 'Hepatitis B immunization for unvaccinated individuals.'],

            // Laboratory
            ['name' => 'Complete Blood Count (CBC)',  'category' => 'Laboratory',       'duration' => 20,  'price' => 450.00,  'description' => 'Blood test measuring red cells, white cells, platelets, and hemoglobin.'],
            ['name' => 'Blood Chemistry Panel',       'category' => 'Laboratory',       'duration' => 20,  'price' => 800.00,  'description' => 'Comprehensive metabolic panel checking kidney, liver, and blood sugar levels.'],
            ['name' => 'Urinalysis',                  'category' => 'Laboratory',       'duration' => 15,  'price' => 300.00,  'description' => 'Urine sample analysis to detect infections and kidney conditions.'],

            // Psychiatry
            ['name' => 'Psychiatric Consultation',    'category' => 'Psychiatry',       'duration' => 60,  'price' => 2000.00, 'description' => 'Mental health evaluation and consultation with a licensed psychiatrist.'],
            ['name' => 'Mental Health Assessment',    'category' => 'Psychiatry',       'duration' => 60,  'price' => 1800.00, 'description' => 'Structured psychological assessment for anxiety, depression, and other conditions.'],

            // Radiology
            ['name' => 'X-Ray',                       'category' => 'Radiology',        'duration' => 20,  'price' => 600.00,  'description' => 'Standard X-ray imaging for bones, chest, and organs.'],
            ['name' => 'Ultrasound',                  'category' => 'Radiology',        'duration' => 30,  'price' => 1200.00, 'description' => 'Ultrasound imaging for abdominal, pelvic, and thyroid evaluation.'],

            // Therapy
            ['name' => 'Physical Therapy Session',    'category' => 'Therapy',          'duration' => 60,  'price' => 1000.00, 'description' => 'Rehabilitation exercises and manual therapy for injury recovery.'],
            ['name' => 'Occupational Therapy',        'category' => 'Therapy',          'duration' => 60,  'price' => 1000.00, 'description' => 'Therapy focused on restoring daily function and independence.'],

            // Diagnostic
            ['name' => 'General Diagnostic Workup',   'category' => 'Diagnostic',       'duration' => 45,  'price' => 1500.00, 'description' => 'A broad diagnostic evaluation to identify underlying conditions.'],

            // Procedure
            ['name' => 'Minor Surgical Procedure',    'category' => 'Procedure',        'duration' => 60,  'price' => 3000.00, 'description' => 'Minor outpatient surgical procedures done under local anesthesia.'],
        ];

        foreach ($services as $data) {
            Service::firstOrCreate(
                ['name' => $data['name']],
                array_merge($data, ['status' => 'active'])
            );
        }
    }
}
