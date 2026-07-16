<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement('ALTER TABLE users ALTER COLUMN current_team_id TYPE char(26) USING current_team_id::char(26)');
        DB::statement('ALTER TABLE users ADD CONSTRAINT users_current_team_id_foreign FOREIGN KEY (current_team_id) REFERENCES teams(id) ON DELETE SET NULL');

        DB::statement('ALTER TABLE tasks ALTER COLUMN assigned_team TYPE char(26) USING assigned_team::char(26)');
        DB::statement('ALTER TABLE tasks ADD CONSTRAINT tasks_assigned_team_foreign FOREIGN KEY (assigned_team) REFERENCES teams(id) ON DELETE SET NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_assigned_team_foreign');
        DB::statement('ALTER TABLE users DROP CONSTRAINT IF EXISTS users_current_team_id_foreign');

        DB::statement('ALTER TABLE tasks ALTER COLUMN assigned_team TYPE text USING assigned_team::text');
        DB::statement('ALTER TABLE users ALTER COLUMN current_team_id TYPE text USING current_team_id::text');
    }
};
