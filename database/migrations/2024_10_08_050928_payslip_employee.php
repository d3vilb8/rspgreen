<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payslip_employee', function (Blueprint $table) {
            $table->id();  // Auto-increment ID
            $table->foreignId('employee_id')->constrained()->onDelete('cascade'); // Foreign key to employees table
            $table->date('date');
            $table->date('salary_month')->nullable();
            $table->string('overtime')->nullable();
            $table->double('net_payble')->nullable();
            $table->string('created_by')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
