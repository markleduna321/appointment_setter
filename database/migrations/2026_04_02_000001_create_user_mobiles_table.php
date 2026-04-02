<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_mobiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('mobile')->unique();
            $table->timestamps();
        });

        // migrate existing phone values from users.phone (if present)
        if (Schema::hasColumn('users', 'phone')) {
            $users = DB::table('users')->whereNotNull('phone')->get(['id', 'phone']);
            $now = now();
            foreach ($users as $u) {
                DB::table('user_mobiles')->insert([
                    'user_id' => $u->id,
                    'mobile' => $u->phone,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }

            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('phone');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // restore phone column on users and copy back
        if (! Schema::hasColumn('users', 'phone')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('phone')->nullable()->after('email');
            });

            $mobiles = DB::table('user_mobiles')->get(['user_id', 'mobile']);
            foreach ($mobiles as $m) {
                DB::table('users')->where('id', $m->user_id)->update(['phone' => $m->mobile]);
            }
        }

        Schema::dropIfExists('user_mobiles');
    }
};
