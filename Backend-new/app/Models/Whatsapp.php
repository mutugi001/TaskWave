<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Whatsapp extends Model
{
    protected $fillable = [
        'user_id',
        'number',
        'token'

    ];

    public function user(){
        return $this->belongsTo(User::class);
    }


}
