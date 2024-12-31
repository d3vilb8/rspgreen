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
        Schema::create('complaints', function (Blueprint $table) {
            $table->id();
            $table->string('complaint_no');
            $table->date('date');
            $table->unsignedBigInteger('customer_id');
            $table->string('complaint_type');
            $table->text('description');
            $table->unsignedBigInteger('product_id');
            $table->unsignedBigInteger('assigned_id');
            $table->date('assigned_date');
            $table->string('status')->default('open');
            $table->string('mobile_no');
            $table->string('email');
            $table->text('address');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('complaints');
    }
};
