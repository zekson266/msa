<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Http\Resources\PostResource;
use App\Models\Post;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use Illuminate\Support\Facades\Storage;

use function Laravel\Prompts\error;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        return PostResource::collection(
            Post::with('user')->latest()->paginate(5)
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePostRequest $request)
    {
        //
        $data = $request->validated();

        $data['user_id'] = Auth::id();

        if($data['photo']){
            Storage::disk('react')->copy($data['photo'], substr($data['photo'],3));
            Storage::disk('react')->delete($data['photo']);
            $data['photo'] = substr($data['photo'],3);
        } else {
            unset($data['photo']);
        }

        $post = Post::create($data);

        return response(new PostResource($post),200);
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        return new PostResource($post);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePostRequest $request, Post $post)
    {
        $this->authorize('update', $post);

        $data = $request->validated();

        if($data['photo']){
           Storage::disk('react')->copy($data['photo'], substr($data['photo'],3));
           Storage::disk('react')->delete($data['photo']);
           $data['photo'] = substr($data['photo'],3);
        } else {
            unset($data['photo']);
        }

        $post->update($data);

        return response(new PostResource($post),200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        //
        $photo = $post->photo;

        $post->delete();
        
        if (!empty($photo) && Storage::disk('react')->exists($photo)) {
            try {
                Storage::disk('react')->delete($photo);
            } catch (Exception $e) {
                // Ігноруємо помилку видалення фото і не робимо нічого
            }
        }
        
        return response('', 200);
        
    }

    /**
     * Upload post image file.
     */
    public function image_upload(Request $request)
    {
        $data = $request->validate([
            'photo' => ['image','max:2000']
        ]);

        if ($request->hasFile('photo')){
           $path = $request->file('photo')->store('tmp/post_img/', 'react');
        return response($path);
        }
        
    }
    /**
     * Test method
     */
    
    public function test(Request $request)
    {
        Storage::disk('local')->put('example.txt', 'Contents');
    }
}