<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cats', function (Blueprint $table) {
            $table->dropColumn('birth_date');
            $table->unsignedTinyInteger('age')->nullable()->after('gender');
        });
    }

    public function down(): void
    {
        Schema::table('cats', function (Blueprint $table) {
            $table->dropColumn('age');
            $table->date('birth_date')->nullable()->after('gender');
        });
    }
};
