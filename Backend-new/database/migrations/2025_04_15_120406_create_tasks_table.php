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
        Schema::create('tasks', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('project_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->string('description');
            $table->string('status')->nullable();
            $table->date('due_date');
            $table->foreignUlid('assigned_team')->nullable()->constrained('teams')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('task_dependencies', function (Blueprint $table) {
            $table->ulid('tasks_id');
            $table->ulid('dependent_task_id');
            $table->foreign('tasks_id')->references('id')->on('tasks')->onDelete('cascade');
            $table->foreign('dependent_task_id')->references('id')->on('tasks')->onDelete('cascade');
            $table->primary(['tasks_id', 'dependent_task_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
