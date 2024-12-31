<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\DatabaseMessage;
use Illuminate\Notifications\Notification;

class HolidayAssignedNotification extends Notification
{
    use Queueable;

    protected $holidayAssignment;
    protected $message;

    /**
     * Create a new notification instance.
     *
     * @param array $holidayAssignment
     * @param string $message
     */
    public function __construct($holidayAssignment, $message)
    {
        $this->holidayAssignment = $holidayAssignment;
        $this->message = $message;
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
            ->subject('Holiday Assignment Notification')
            ->greeting('Hello,')
            ->line($this->message) // Custom message
            ->line('Holiday ID: ' . $this->holidayAssignment['holiday_id'])
            ->line('Employee ID: ' . $this->holidayAssignment['employee_id'])
            ->action('View Details', '/holiday-details/')
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
            'holiday_id' => $this->holidayAssignment['holiday_id'],
            'employee_id' => $this->holidayAssignment['employee_id'],
            'message' => $this->message, // Custom message
            'url' => '/holiday-details/',
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
