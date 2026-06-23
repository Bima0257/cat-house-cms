<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reservation_id')->constrained()->cascadeOnDelete();
            $table->enum('payment_method', ['transfer', 'tunai'])->default('transfer');
            $table->decimal('amount', 12, 2);
            $table->string('proof')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->enum('status', ['pending', 'terverifikasi', 'gagal'])->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
