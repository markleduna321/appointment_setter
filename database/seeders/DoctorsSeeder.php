<?php

namespace Database\Seeders;

use App\Models\Doctor;
use Illuminate\Database\Seeder;

class DoctorsSeeder extends Seeder
{
    public function run(): void
    {
        $doctors = [
            // General Practice
            [
                'name'           => 'John Santos',
                'specialty'      => 'General Practice',
                'email'          => 'john.santos@clinic.com',
                'phone'          => '09171234001',
                'bio'            => 'Board-certified general practitioner with over 10 years of clinical experience.',
                'status'         => 'available',
                'schedule_days'  => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                'schedule_start' => '08:00',
                'schedule_end'   => '17:00',
            ],
            [
                'name'           => 'Maria Cruz',
                'specialty'      => 'General Practice',
                'email'          => 'maria.cruz@clinic.com',
                'phone'          => '09171234002',
                'bio'            => 'Family medicine specialist focused on preventive care and chronic disease management.',
                'status'         => 'available',
                'schedule_days'  => ['Mon', 'Wed', 'Fri'],
                'schedule_start' => '09:00',
                'schedule_end'   => '18:00',
            ],

            // Dental
            [
                'name'           => 'Carlos Rivera',
                'specialty'      => 'Dental',
                'email'          => 'carlos.rivera@clinic.com',
                'phone'          => '09171234003',
                'bio'            => 'Licensed dentist specializing in restorative and cosmetic dentistry.',
                'status'         => 'available',
                'schedule_days'  => ['Mon', 'Tue', 'Thu', 'Sat'],
                'schedule_start' => '08:00',
                'schedule_end'   => '16:00',
            ],
            [
                'name'           => 'Ana Reyes',
                'specialty'      => 'Dental',
                'email'          => 'ana.reyes@clinic.com',
                'phone'          => '09171234004',
                'bio'            => 'General dentist with expertise in orthodontics and oral surgery.',
                'status'         => 'available',
                'schedule_days'  => ['Tue', 'Wed', 'Fri', 'Sat'],
                'schedule_start' => '10:00',
                'schedule_end'   => '18:00',
            ],

            // Cardiology
            [
                'name'           => 'Robert Chen',
                'specialty'      => 'Cardiology',
                'email'          => 'robert.chen@clinic.com',
                'phone'          => '09171234005',
                'bio'            => 'Interventional cardiologist with expertise in heart failure and coronary artery disease.',
                'status'         => 'available',
                'schedule_days'  => ['Mon', 'Wed', 'Fri'],
                'schedule_start' => '08:00',
                'schedule_end'   => '15:00',
            ],
            [
                'name'           => 'Elaine Tan',
                'specialty'      => 'Cardiology',
                'email'          => 'elaine.tan@clinic.com',
                'phone'          => '09171234006',
                'bio'            => 'Cardiologist specializing in non-invasive cardiac imaging and preventive cardiology.',
                'status'         => 'on_leave',
                'schedule_days'  => ['Tue', 'Thu'],
                'schedule_start' => '09:00',
                'schedule_end'   => '17:00',
            ],

            // Pediatrics
            [
                'name'           => 'Lisa Mendoza',
                'specialty'      => 'Pediatrics',
                'email'          => 'lisa.mendoza@clinic.com',
                'phone'          => '09171234007',
                'bio'            => 'Pediatrician with 8 years of experience in newborn care and adolescent medicine.',
                'status'         => 'available',
                'schedule_days'  => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                'schedule_start' => '08:00',
                'schedule_end'   => '16:00',
            ],
            [
                'name'           => 'Kevin Lim',
                'specialty'      => 'Pediatrics',
                'email'          => 'kevin.lim@clinic.com',
                'phone'          => '09171234008',
                'bio'            => 'Developmental pediatrician specializing in behavioral and developmental disorders.',
                'status'         => 'available',
                'schedule_days'  => ['Mon', 'Wed', 'Fri'],
                'schedule_start' => '09:00',
                'schedule_end'   => '17:00',
            ],

            // Dermatology
            [
                'name'           => 'Grace Park',
                'specialty'      => 'Dermatology',
                'email'          => 'grace.park@clinic.com',
                'phone'          => '09171234009',
                'bio'            => 'Board-certified dermatologist specializing in acne, eczema, and skin cancer screening.',
                'status'         => 'available',
                'schedule_days'  => ['Tue', 'Thu', 'Sat'],
                'schedule_start' => '09:00',
                'schedule_end'   => '17:00',
            ],

            // OB-GYN
            [
                'name'           => 'Patricia Gomez',
                'specialty'      => 'OB-GYN',
                'email'          => 'patricia.gomez@clinic.com',
                'phone'          => '09171234010',
                'bio'            => 'OB-GYN specialist with extensive experience in prenatal care and gynecological surgery.',
                'status'         => 'available',
                'schedule_days'  => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                'schedule_start' => '08:00',
                'schedule_end'   => '17:00',
            ],
            [
                'name'           => 'Sandra Torres',
                'specialty'      => 'OB-GYN',
                'email'          => 'sandra.torres@clinic.com',
                'phone'          => '09171234011',
                'bio'            => 'Obstetrician-gynecologist focused on high-risk pregnancies and reproductive health.',
                'status'         => 'available',
                'schedule_days'  => ['Mon', 'Wed', 'Fri'],
                'schedule_start' => '10:00',
                'schedule_end'   => '18:00',
            ],

            // Orthopedics
            [
                'name'           => 'Michael Torres',
                'specialty'      => 'Orthopedics',
                'email'          => 'michael.torres@clinic.com',
                'phone'          => '09171234012',
                'bio'            => 'Orthopedic surgeon specializing in sports injuries, joint replacements, and spine care.',
                'status'         => 'available',
                'schedule_days'  => ['Mon', 'Tue', 'Thu'],
                'schedule_start' => '08:00',
                'schedule_end'   => '16:00',
            ],

            // Eye Care
            [
                'name'           => 'James Castillo',
                'specialty'      => 'Eye Care',
                'email'          => 'james.castillo@clinic.com',
                'phone'          => '09171234013',
                'bio'            => 'Ophthalmologist specializing in refractive surgery, cataracts, and diabetic eye disease.',
                'status'         => 'available',
                'schedule_days'  => ['Mon', 'Wed', 'Fri'],
                'schedule_start' => '09:00',
                'schedule_end'   => '17:00',
            ],

            // Vaccination
            [
                'name'           => 'Sofia Villanueva',
                'specialty'      => 'Vaccination',
                'email'          => 'sofia.villanueva@clinic.com',
                'phone'          => '09171234014',
                'bio'            => 'Immunization specialist with training in travel medicine and pediatric vaccination programs.',
                'status'         => 'available',
                'schedule_days'  => ['Tue', 'Thu', 'Sat'],
                'schedule_start' => '08:00',
                'schedule_end'   => '16:00',
            ],

            // Laboratory
            [
                'name'           => 'Mia Lorenzo',
                'specialty'      => 'Laboratory',
                'email'          => 'mia.lorenzo@clinic.com',
                'phone'          => '09171234015',
                'bio'            => 'Clinical pathologist overseeing laboratory diagnostics and test interpretation.',
                'status'         => 'available',
                'schedule_days'  => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                'schedule_start' => '07:00',
                'schedule_end'   => '15:00',
            ],

            // Psychiatry
            [
                'name'           => 'David Kim',
                'specialty'      => 'Psychiatry',
                'email'          => 'david.kim@clinic.com',
                'phone'          => '09171234016',
                'bio'            => 'Psychiatrist specializing in mood disorders, anxiety, and cognitive behavioral therapy.',
                'status'         => 'available',
                'schedule_days'  => ['Mon', 'Wed', 'Thu'],
                'schedule_start' => '10:00',
                'schedule_end'   => '18:00',
            ],

            // Radiology
            [
                'name'           => 'Elena Vasquez',
                'specialty'      => 'Radiology',
                'email'          => 'elena.vasquez@clinic.com',
                'phone'          => '09171234017',
                'bio'            => 'Radiologist experienced in X-ray, ultrasound, CT, and MRI interpretation.',
                'status'         => 'available',
                'schedule_days'  => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                'schedule_start' => '08:00',
                'schedule_end'   => '16:00',
            ],

            // Therapy
            [
                'name'           => 'Raj Patel',
                'specialty'      => 'Therapy',
                'email'          => 'raj.patel@clinic.com',
                'phone'          => '09171234018',
                'bio'            => 'Licensed physical therapist specializing in neurorehabilitation and sports recovery.',
                'status'         => 'available',
                'schedule_days'  => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                'schedule_start' => '08:00',
                'schedule_end'   => '17:00',
            ],

            // Diagnostic
            [
                'name'           => 'Diana Wong',
                'specialty'      => 'Diagnostic',
                'email'          => 'diana.wong@clinic.com',
                'phone'          => '09171234019',
                'bio'            => 'Internal medicine specialist conducting comprehensive diagnostic evaluations.',
                'status'         => 'available',
                'schedule_days'  => ['Mon', 'Wed', 'Fri'],
                'schedule_start' => '09:00',
                'schedule_end'   => '17:00',
            ],

            // Procedure
            [
                'name'           => 'Jonathan Cruz',
                'specialty'      => 'Procedure',
                'email'          => 'jonathan.cruz@clinic.com',
                'phone'          => '09171234020',
                'bio'            => 'General surgeon skilled in minor outpatient procedures and wound management.',
                'status'         => 'available',
                'schedule_days'  => ['Tue', 'Thu', 'Sat'],
                'schedule_start' => '08:00',
                'schedule_end'   => '15:00',
            ],
        ];

        foreach ($doctors as $data) {
            Doctor::firstOrCreate(
                ['email' => $data['email']],
                $data
            );
        }
    }
}
