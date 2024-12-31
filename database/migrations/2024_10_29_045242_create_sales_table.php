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
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->string('bill_no');
            $table->unsignedBigInteger('customer_id');
            $table->date('date');
            $table->text('billing_address');
            $table->string('status');
            $table->string('amc_type');
            $table->integer('discount')->default(0);
            $table->string('mobile_no');
            $table->string('email');
            $table->json('sales_details');
            $table->json('account_tax');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};
