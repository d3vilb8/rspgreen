<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\DatabaseMessage;
use Illuminate\Notifications\Notification;

class LeaveNotif extends Notification
{
    use Queueable;

    protected $leaveData;

    /**
     * Create a new notification instance.
     *
     * @param array $leaveData
     */
    public function __construct($leaveData)
    {
        $this->leaveData = $leaveData;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail', 'database'];  // Send both mail and database notifications
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param mixed $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('New Leave Request Submitted')
            ->greeting('Hello Admin,')
            ->line('An employee has applied for leave.')
            ->line('Employee ID: ' . $this->leaveData['employee_id'])
            ->line('Leave Type: ' . $this->leaveData['leave_type'])
            ->line('From: ' . $this->leaveData['sdate'] . ' To: ' . $this->leaveData['edate'])
            ->line('Reason: ' . $this->leaveData['reason'])
            ->action('View Leave Requests', url('/leave-index'))
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification for the database.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function toDatabase($notifiable)
    {
        return [
            'employee_id' => $this->leaveData['employee_id'],
            'leave_type' => $this->leaveData['leave_type'],
            'sdate' => $this->leaveData['sdate'],
            'edate' => $this->leaveData['edate'],
            'reason' => $this->leaveData['reason'],
            'message' => $this->leaveData['message'], // Include the custom message
            'url' => '/leave-index',
        ];
    }

    /**
     * Get the array representation of the notification for broadcasting or fallback purposes.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return $this->toDatabase($notifiable);
    }
}
