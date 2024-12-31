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
        Schema::create('timesheets', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('project_id');
            $table->unsignedBigInteger('task_id');
            $table->date('date'); // Or use datetime if necessary
            $table->decimal('field1', 5, 2)->default(0);
            $table->decimal('field2', 5, 2)->default(0);
            $table->decimal('field3', 5, 2)->default(0);
            $table->decimal('field4', 5, 2)->default(0);
            $table->decimal('field5', 5, 2)->default(0);
            $table->decimal('field6', 5, 2)->default(0);
            $table->decimal('field7', 5, 2)->default(0);
            $table->timestamps();

            // Foreign keys
            // $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
            $table->foreign('task_id')->references('id')->on('tasks')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('timesheets');
    }
};
