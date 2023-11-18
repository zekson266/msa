<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CommentResource;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        //
        return CommentResource::collection(
            Comment::where('parent_id',$request->parentId)->paginate(50)
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $data = $request->validate([
            'parent_id' => ['required'],
            'parent_type' => ['required'],
            'author' => ['required','max:55','min:5', Rule::unique('users','name')->ignore(auth('api')->user()->id)],
            'comment' => ['max:200','min:5'],
        ]);

        $data['parent_type'] = 'App\Models\\' . $data['parent_type'];

        $comment = Comment::create($data);

        return response(new CommentResource($comment),200);
    }

    /**
     * Display the specified resource.
     */
    public function show(Comment $comment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Comment $comment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Comment $comment)
    {
        //
    }
}
