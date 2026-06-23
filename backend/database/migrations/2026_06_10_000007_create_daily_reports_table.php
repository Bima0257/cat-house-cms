<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('daily_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reservation_id')->constrained()->cascadeOnDelete();
            $table->string('photo')->nullable();
            $table->string('food', 100)->nullable();
            $table->string('drink', 100)->nullable();
            $table->decimal('weight', 5, 2)->nullable();
            $table->text('activity')->nullable();
            $table->text('medicine')->nullable();
            $table->enum('condition', ['sehat', 'sakit', 'cedera'])->default('sehat');
            $table->text('note')->nullable();
            $table->date('report_date');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_reports');
    }
};
