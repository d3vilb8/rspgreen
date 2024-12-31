<?php

namespace App\Exports;

use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ExcelExport implements FromArray, WithHeadings
{
    public $sheets;
    protected $includeEmployeeName;

    public function __construct($timesheets)
    {
        $this->sheets = $timesheets;
        $this->includeEmployeeName = $this->shouldIncludeEmployeeName();
    }

    public function headings(): array
    {
        $headings = [];

        if ($this->includeEmployeeName) {
            $headings[] = 'Employee Name';
        }

        $headings = array_merge($headings, [
            'Project Title',
            'Task Name',
            'Date',
            'Time Spent (Hours)',
            'Description',
        ]);

        return $headings;
    }

    public function array(): array
    {
        $formattedData = [];

        foreach ($this->sheets as $sheet) {
            $row = [];

            if ($this->includeEmployeeName) {
                $row[] = $sheet->name;
            }

            $row = array_merge($row, [
                $sheet->title,
                $sheet->task_name,
                $sheet->date,
                $sheet->time_number,
                $sheet->description,
            ]);

            $formattedData[] = $row;
        }

        return $formattedData;
    }

    protected function shouldIncludeEmployeeName()
    {
        if (Auth::user()->hasRole('admin')) {
            return true;
        }
        return false;
    }
}
