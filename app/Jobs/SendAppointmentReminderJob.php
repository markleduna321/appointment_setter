<?php

namespace App\Jobs;

use App\Mail\AppointmentReminderMail;
use App\Models\Appointment;
use App\Services\NotificationService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendAppointmentReminderJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $backoff = 60;

    public function __construct(public readonly Appointment $appointment) {}

    public function handle(): void
    {
        $appt = $this->appointment;

        // In-app notification
        if ($appt->user_id) {
            $date = $appt->date->format('M d, Y');
            NotificationService::send(
                $appt->user_id,
                'appointment_reminder',
                'Appointment Tomorrow',
                "Reminder: your {$appt->service} with {$appt->doctor_name} is scheduled for tomorrow, {$date} at {$appt->time}.",
                $appt->id
            );
        }

        // Email notification — only if the patient has an email address
        $email = $appt->patient?->email;
        if ($email) {
            Mail::to($email)->send(new AppointmentReminderMail($appt));
        }
    }
}
