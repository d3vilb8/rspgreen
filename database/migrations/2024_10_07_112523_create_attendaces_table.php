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
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();  // Auto-increment ID
            $table->foreignId('employee_id')->constrained()->onDelete('cascade'); // Foreign key to employees table
            $table->date('date'); // Date of the attendance
            $table->time('in_time')->nullable(); // In time (nullable in case employee forgets to clock in)
            $table->time('out_time')->nullable(); // Out time (nullable in case employee forgets to clock out)
            $table->timestamps(); // Created at and updated at timestamps
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendaces');
    }
};
