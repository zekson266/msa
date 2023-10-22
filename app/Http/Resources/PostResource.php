<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public static $wrap = false;

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'author' => $this->user->name,
            'title' => $this->title,
            'body' => $this->body,
            'photo' => $this->photo,
            'category' => $this->category,
            'rating' => $this->rating,
            'active' => $this->active
        ];
    }
}
