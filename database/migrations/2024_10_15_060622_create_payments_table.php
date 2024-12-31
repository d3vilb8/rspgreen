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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained('tasks')->cascadeOnDelete();
            $table->foreignId('project_stage_id')->constrained('project_stages')->cascadeOnDelete();
            $table->string('order_id')->nullable();
            $table->decimal('amount',10,2)->default(0);
            $table->string('transaction_id')->nullable();
            $table->decimal('transaction_amount',10,2)->default(0);
            $table->boolean('is_paid')->default(0);
            $table->string('payment_method')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
