<?php

namespace App\Services;

use App\Events\AppointmentNotificationSent;
use App\Models\AppNotification;
use App\Models\Appointment;

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

        broadcast(new AppointmentNotificationSent($notification));
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
                break;

            case 'cancelled':
                self::send($userId, 'appointment_cancelled',
                    'Appointment Cancelled',
                    "Your appointment for {$service} with {$doctor} on {$date} has been cancelled.",
                    $appt->id
                );
                break;

            case 'completed':
                self::send($userId, 'appointment_completed',
                    'Appointment Completed',
                    "Your appointment for {$service} with {$doctor} on {$date} has been marked as completed.",
                    $appt->id
                );
                break;

            case 'pending':
                // status moved back to pending — treat as rescheduled
                if ($oldStatus !== 'pending') {
                    self::send($userId, 'appointment_rescheduled',
                        'Appointment Rescheduled',
                        "Your appointment for {$service} with {$doctor} has been rescheduled to {$date}.",
                        $appt->id
                    );
                }
                break;
        }
    }
}
