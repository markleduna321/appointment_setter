<?php

namespace App\Console\Commands;

use App\Jobs\SendAppointmentReminderJob;
use App\Models\Appointment;
use Illuminate\Console\Command;

class SendAppointmentReminders extends Command
{
    protected $signature   = 'reminders:send';
    protected $description = 'Dispatch reminder jobs for confirmed appointments scheduled for tomorrow.';

    public function handle(): int
    {
        $tomorrow = now()->addDay()->toDateString();

        $appointments = Appointment::with('patient')
            ->where('status', 'confirmed')
            ->whereDate('date', $tomorrow)
            ->get();

        if ($appointments->isEmpty()) {
            $this->info('No appointments to remind for ' . $tomorrow);
            return self::SUCCESS;
        }

        foreach ($appointments as $appt) {
            SendAppointmentReminderJob::dispatch($appt);
        }

        $this->info("Dispatched {$appointments->count()} reminder(s) for {$tomorrow}.");

        return self::SUCCESS;
    }
}
