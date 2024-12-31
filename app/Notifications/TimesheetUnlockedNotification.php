<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class TimesheetUnlockedNotification extends Notification
{
    use Queueable;

    protected $timesheet;
    protected $userName;

    public function __construct($timesheet, $userName)
    {
        $this->timesheet = $timesheet;
        $this->userName = $userName;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Timesheet Unlocked')
            ->line('Your timesheet for project ID ' . $this->timesheet->project_id . ' has been unlocked by ' . $this->userName . '.')
            ->action('View Timesheet', url('/timesheets/' . $this->timesheet->id))
            ->line('Please review the updated timesheet.');
    }

    public function toArray($notifiable)
    {
        return [
            'message' => 'Your timesheet for project  ' . ' has been unlocked by ' . $this->userName . '.',
            'timesheet_id' => $this->timesheet->id,
            'url' => url('/daily-status/'),
        ];
    }
}
