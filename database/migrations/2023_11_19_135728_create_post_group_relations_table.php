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
        Schema::create('post_group_relations', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->foreignId('post_id')->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('post_group_id')->constrained()->cascadeOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('post_group_relations');
    }
};
