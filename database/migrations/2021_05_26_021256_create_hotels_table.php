<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHotelsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('hotels', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone', 15)->nullable();
            $table->double('price_min')->unsigned()->nullable()->default(0);
            $table->double('lat')->nullable()->default(0);
            $table->double('lng')->nullable()->default(0);
            $table->string('address');
            $table->foreignId('location_id')->nullable()->constrained('locations')->onDelete('cascade');
            $table->foreignId('ward_id')->nullable()->constrained('wards')->onDelete('cascade');
            $table->foreignId('district_id')->nullable()->constrained('districts')->onDelete('cascade');
            $table->foreignId('province_id')->nullable()->constrained('provinces')->onDelete('cascade');
            $table->tinyInteger('reviews')->nullable()->default(1);
            $table->text('description')->nullable();
            $table->string('title')->nullable();
            $table->longText('content')->nullable();
            $table->boolean('is_approved')->default(false);
            $table->foreignId('creator_id')->nullable()->constrained('users')->onDelete('cascade');
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
        Schema::dropIfExists('hotels');
    }
}
