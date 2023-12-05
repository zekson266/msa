<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserGroupRelation extends Model
{
    use HasFactory;

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function userGroup(){
        return $this->belongsTo(UserGroup::class);
    }
    
    protected $fillable = [
        'user_id',
        'user_groups_id',
    ];
}
