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
    Schema::create('salaries', function (Blueprint $table) {
        $table->id();
        $table->string('salary_name');
        $table->date('generate_date');
        $table->string('generate_by');
        $table->enum('status', ['Approved', 'Pending'])->default('Pending');
        $table->date('approved_date')->nullable();
        $table->string('approved_by')->nullable();
        
        // Define employee_id as a foreign key (without 'after')
        $table->unsignedBigInteger('employee_id');
        
        // Assuming you have employees table and employee model
        $table->foreign('employee_id')->references('id')->on('employees')->onDelete('cascade');

        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('salaries');
    }
};
