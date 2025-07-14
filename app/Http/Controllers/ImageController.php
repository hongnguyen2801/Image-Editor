<?php

namespace App\Http\Controllers;

use App\Models\Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ImageController extends Controller
{
    public function index(Request $request)
    {
        $pageSize = $request->input('pageSize', 15); // số ảnh mỗi trang
        $images = Image::latest()->paginate($pageSize);

        return response()->json([
            'images' => $images->items(),       // danh sách ảnh hiện tại
            'total' => $images->total(),        // tổng số ảnh
            'page' => $images->currentPage(),   // trang hiện tại
            'pageSize' => $images->perPage(),   // số ảnh mỗi trang
            'lastPage' => $images->lastPage(),  // tổng số trang
    ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'url' => 'required|url',
        ]);

        return Image::create([
            'url' => $request->url,
        ]);
    }

    public function destroy($id)
    {
        try {
            $image = Image::findOrFail($id);
            $image->delete();

            return response()->json(['message' => 'Đã xoá ảnh thành công']);
        } catch (\Throwable $e) {
            Log::error("Lỗi xoá ảnh:", ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'Xoá ảnh thất bại',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}