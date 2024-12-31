<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\Timesheet;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class SubmitStatus extends Command
{
    // The name and signature of the command
    protected $signature = 'task:submit';

    // The description of the command
    protected $description = 'Auto submit task at 11:59 PM every Friday';

    // Execute the command
    public function handle()
    {
        // Fetch timesheets for the current authenticated user
        $user_ids = User::role('employee')->get()->pluck('id');
        //
        foreach ($user_ids as $user_id) {
            // Retrieve timesheets that need to be submitted
            $timesheets = Timesheet::where('user_id', $user_id)
                ->where('status', '0') // Get timesheets that are not yet submitted
                ->get();

            foreach ($timesheets as $timesheet) {
                Log::info('Processing timesheet', [
                    'user_id' => $timesheet->user_id,
                    'project_id' => $timesheet->project_id,
                    'task_id' => $timesheet->task_id,
                    'date' => $timesheet->date,
                    'time_number' => $timesheet->time_number,
                ]);

                // Update the status to '1' (submitted)
                $timesheet->status = 1;
                $timesheet->save();
            }
        }

        $this->info('status : submission complete.');
    }
}
