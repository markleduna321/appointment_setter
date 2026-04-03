<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Appointment Completed</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f3f4f6; margin: 0; padding: 0; }
        .wrapper { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,.08); }
        .header { background: linear-gradient(135deg, #7c3aed, #a855f7); padding: 36px 40px; text-align: center; }
        .header h1 { color: #fff; margin: 0; font-size: 22px; font-weight: 700; }
        .header p { color: rgba(255,255,255,.85); margin: 6px 0 0; font-size: 14px; }
        .body { padding: 36px 40px; }
        .greeting { font-size: 16px; color: #374151; margin-bottom: 20px; }
        .badge { display: inline-flex; align-items: center; gap: 6px; background: #ede9fe; color: #5b21b6; font-size: 13px; font-weight: 700; padding: 6px 14px; border-radius: 100px; margin-bottom: 24px; }
        .card { background: #faf5ff; border: 1px solid #ddd6fe; border-radius: 12px; padding: 20px 24px; margin-bottom: 24px; }
        .card-row { display: flex; gap: 12px; margin-bottom: 12px; align-items: flex-start; }
        .card-row:last-child { margin-bottom: 0; }
        .label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: #7c3aed; min-width: 80px; padding-top: 2px; }
        .value { font-size: 14px; color: #1f2937; font-weight: 600; }
        .btn { display: inline-block; background: #7c3aed; color: #fff; text-decoration: none; padding: 13px 28px; border-radius: 10px; font-weight: 700; font-size: 14px; margin-top: 4px; }
        .footer { text-align: center; padding: 20px 40px 32px; font-size: 12px; color: #9ca3af; }
        .footer a { color: #7c3aed; text-decoration: none; }
    </style>
</head>
<body>
<div class="wrapper">
    <div class="header">
        <h1>🏁 Appointment Completed</h1>
        <p>Thank you for your visit</p>
    </div>

    <div class="body">
        <p class="greeting">
            Hi {{ $appointment->patient?->name ?? 'there' }},
        </p>

        <div class="badge">
            <span>🏁</span> Completed
        </div>

        <p style="font-size:15px;color:#374151;margin-bottom:24px;">
            Your appointment has been marked as <strong>completed</strong>.
            Thank you for choosing {{ config('app.name') }} — we hope your visit went well!
        </p>

        <div class="card">
            <div class="card-row">
                <span class="label">Service</span>
                <span class="value">{{ $appointment->service }}</span>
            </div>
            <div class="card-row">
                <span class="label">Doctor</span>
                <span class="value">{{ $appointment->doctor_name }}</span>
            </div>
            <div class="card-row">
                <span class="label">Date</span>
                <span class="value">{{ $appointment->date->format('l, F j, Y') }}</span>
            </div>
            <div class="card-row">
                <span class="label">Time</span>
                <span class="value">{{ $appointment->time }}</span>
            </div>
        </div>

        <p style="font-size:13px;color:#6b7280;margin-bottom:24px;">
            Need to book another appointment? Log in to schedule your next visit anytime.
        </p>

        <a href="{{ config('app.url') }}/appointments/new" class="btn">Book Another Appointment</a>
    </div>

    <div class="footer">
        <p>© {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
        <p>You're receiving this because you recently had an appointment with us.</p>
    </div>
</div>
</body>
</html>
