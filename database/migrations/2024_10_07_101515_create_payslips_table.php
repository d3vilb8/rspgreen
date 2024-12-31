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
        Schema::create('payslips', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('paid_amount')->default(0);
            $table->boolean('status')->default(0);
            $table->string('salary_month');
            $table->string('basic_salary');
            $table->text('allowance')->nullable();
            $table->text('commission')->nullable();
            $table->text('loan')->nullable();
            $table->text('saturation_deduction')->nullable();
            $table->text('other_payments')->nullable();
            $table->integer('pay_status')->nullable();
            $table->string('name')->nullable();
            $table->string('email')->nullable();
            $table->string('url')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payslips');
    }
};
