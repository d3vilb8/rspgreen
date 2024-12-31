<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStageOfProjectsTable extends Migration
{
    public function up()
    {
        Schema::create('stage_of_projects', function (Blueprint $table) {
            $table->id();
            $table->string('name'); 
            $table->timestamps(); 
        });
    }

    public function down()
    {
        Schema::dropIfExists('stage_of_projects');
    }
}
