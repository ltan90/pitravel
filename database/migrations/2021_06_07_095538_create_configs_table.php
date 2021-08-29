<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateConfigsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('configs', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('entity_id');
            $table->string('entity_type');
            $table->text('value');
            // id of users
            $table->index('created_by');
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            // id of users
            $table->index('updated_by');
            $table->foreignId('updated_by')->constrained('users')->onDelete('cascade');
            // id of users
            $table->index('deleted_by');
            $table->foreignId('deleted_by')->constrained('users')->onDelete('cascade');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('configs');
    }
}
