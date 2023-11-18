<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    public function user(){
        return $this->belongsTo(User::class,'user_id');
    }

    public function comments()
    {
        return $this->morphMany(Comment::class, 'parent');
    }

    protected $fillable = [
        'user_id',
        'title',
        'body',
        'photo',
        'category',
        'rating',
        'active'
    ];
}
