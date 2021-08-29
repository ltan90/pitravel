<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBookingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('code');
            $table->index('hotel_id');
            $table->foreignId('hotel_id')->constrained('hotels')->onDelete('cascade');
            $table->index('customer_id');
            $table->foreignId('customer_id')->constrained('customers')->onDelete('cascade');
            $table->dateTime('arrival_date');
            $table->dateTime('departure_date');
            $table->boolean('is_business')->default(false);
            $table->integer('adults')->default(0);
            $table->integer('children')->default(0);
            $table->integer('rooms')->default(0);
            $table->text('note')->nullable();
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
        Schema::dropIfExists('bookings');
    }
}
