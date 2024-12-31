<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLeadStagesTable extends Migration
{
    public function up()
    {
        Schema::create('lead_stages', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); 
            $table->timestamps(); 
        });
    }

    public function down()
    {
        Schema::dropIfExists('lead_stages');
    }
}
