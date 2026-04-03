<?php

namespace App\Services;

use App\Events\AppointmentNotificationSent;
use App\Mail\AppointmentCancelledMail;
use App\Mail\AppointmentCompletedMail;
use App\Mail\AppointmentConfirmedMail;
use App\Mail\AppointmentRescheduledMail;
use App\Models\AppNotification;
use App\Models\Appointment;
use Illuminate\Support\Facades\Mail;

class NotificationService
{
    /**
     * Create a notification record and broadcast it via Pusher.
     */
    public static function send(int $userId, string $type, string $title, string $body, ?int $appointmentId = null): void
    {
        $notification = AppNotification::create([
            'user_id'        => $userId,
            'appointment_id' => $appointmentId,
            'type'           => $type,
            'title'          => $title,
            'body'           => $body,
            'is_read'        => false,
        ]);

        // Broadcast is best-effort — a Pusher failure must never 500 the HTTP request.
        // The notification is already persisted and will be visible on the next poll.
        try {
            broadcast(new AppointmentNotificationSent($notification));
        } catch (\Throwable $e) {
            logger()->warning('Broadcast failed for notification #' . $notification->id . ': ' . $e->getMessage());
        }
    }

    /**
     * Build and send the correct notification for an appointment status change.
     */
    public static function appointmentStatusChanged(Appointment $appt, string $oldStatus): void
    {
        // Manual / phone-in appointments have no linked user account — nothing to notify.
        if (is_null($appt->user_id)) {
            return;
        }

        $newStatus = $appt->status;

        // Send to the patient who owns the appointment
        $userId  = $appt->user_id;
        $service = $appt->service;
        $doctor  = $appt->doctor_name;
        $date    = $appt->date->format('M d, Y');

        switch ($newStatus) {
            case 'confirmed':
                self::send($userId, 'appointment_confirmed',
                    'Appointment Confirmed',
                    "Your appointment for {$service} with {$doctor} on {$date} has been confirmed.",
                    $appt->id
                );
                // Email
                $email = $appt->patient?->email;
                if ($email) {
                    Mail::to($email)->queue(new AppointmentConfirmedMail($appt));
                }
                break;

            case 'cancelled':
                self::send($userId, 'appointment_cancelled',
                    'Appointment Cancelled',
                    "Your appointment for {$service} with {$doctor} on {$date} has been cancelled.",
                    $appt->id
                );
                // Email
                $email = $appt->patient?->email;
                if ($email) {
                    Mail::to($email)->queue(new AppointmentCancelledMail($appt));
                }
                break;

            case 'completed':
                self::send($userId, 'appointment_completed',
                    'Appointment Completed',
                    "Your appointment for {$service} with {$doctor} on {$date} has been marked as completed.",
                    $appt->id
                );
                // Email
                $email = $appt->patient?->email;
                if ($email) {
                    Mail::to($email)->queue(new AppointmentCompletedMail($appt));
                }
                break;

            case 'pending':
                // status moved back to pending — treat as rescheduled
                if ($oldStatus !== 'pending') {
                    self::send($userId, 'appointment_rescheduled',
                        'Appointment Rescheduled',
                        "Your appointment for {$service} with {$doctor} has been rescheduled to {$date}.",
                        $appt->id
                    );
                    // Email
                    $email = $appt->patient?->email;
                    if ($email) {
                        Mail::to($email)->queue(new AppointmentRescheduledMail($appt));
                    }
                }
                break;
        }
    }
}
