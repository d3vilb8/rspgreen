<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class TimesheetStatusChanged extends Notification
{
    use Queueable;

    protected $timesheet;
    protected $username;

    public function __construct($timesheet, $username)
    {
        $this->timesheet = $timesheet;
        $this->username = $username;  // Store the username
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Timesheet Status Updated')
            ->line('A timesheet for project ID ' . $this->timesheet->project_id . ' and task ID ' . $this->timesheet->task_id . ' has been updated by ' . $this->username . ' (user ID: ' . $this->timesheet->user_id . ').')
            ->action('Review Timesheet', url('/admin/timesheets/' . $this->timesheet->id))
            ->line('Please review the updated timesheet.');
    }

    public function toArray($notifiable)
    {
        return [
            'message' => 'Timesheet ssubmit ' . ' updated by ' . $this->username . '.',
            'timesheet_id' => $this->timesheet->id,
            'url' => url('timesheetemp-employee/' . $this->timesheet->user_id) // Proper URL generation
        ];
    }
}
