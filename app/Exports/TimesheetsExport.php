<?php

namespace App\Exports;

use App\Models\Timesheet;
use Maatwebsite\Excel\Concerns\FromCollection;

class TimesheetsExport implements FromCollection
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return Timesheet::all();
    }
    protected $timesheets;

    // Constructor to pass timesheets data
    public function __construct($timesheets)
    {
        $this->timesheets = $timesheets;
    }

    // Define the view that will be used to format the Excel file
    public function view(): View
    {
        return view('exports.timesheets', [
            'timesheets' => $this->timesheets
        ]);
}
