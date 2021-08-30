<?php

namespace App\Traits;

use Carbon\Carbon;
use Image;
use Illuminate\Support\Facades\Storage;

trait ImageSizeTrait
{
    /**
     * Convert Vi To En
     * @param $str
     * @return string
     */
    public function convertViToEn(string $str): string
    {
        $str = preg_replace("/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/", "a", $str);
        $str = preg_replace("/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/", "e", $str);
        $str = preg_replace("/(ì|í|ị|ỉ|ĩ)/", "i", $str);
        $str = preg_replace("/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/", "o", $str);
        $str = preg_replace("/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/", "u", $str);
        $str = preg_replace("/(ỳ|ý|ỵ|ỷ|ỹ)/", "y", $str);
        $str = preg_replace("/(đ)/", "d", $str);
        $str = preg_replace("/(À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ)/", "A", $str);
        $str = preg_replace("/(È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ)/", "E", $str);
        $str = preg_replace("/(Ì|Í|Ị|Ỉ|Ĩ)/", "I", $str);
        $str = preg_replace("/(Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ)/", "O", $str);
        $str = preg_replace("/(Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ)/", "U", $str);
        $str = preg_replace("/(Ỳ|Ý|Ỵ|Ỷ|Ỹ)/", "Y", $str);
        $str = preg_replace("/(Đ)/", "D", $str);

        return $str;
    }

    /**
     * saveImageSize
     * @param object $file
     * @param string $path
     * @param int $id
     * @return array | null
     */
    public function saveImageSize(object $file, string $path = 'images/', int $id)
    {

        if (empty($file)) return null;
        if(!\Storage::disk(config('filesystems.disks.public.visibility'))->has($path)){
            \Storage::makeDirectory(config('filesystems.disks.public.visibility').'/'.$path);
        }

        $arr = [];

        $fileName = $file->getClientOriginalName();
        $fileExt = $file->getClientOriginalExtension();
        $fileMine = $file->getMimeType();
        $exploreFileMine = explode("/", $fileMine);
        $convertPath = str_replace(" ", "-",strtolower(str_replace("." . $exploreFileMine[1], "", $this->convertViToEn($fileName))));
        $convertName = $convertPath . '-' . $id . '-' . Carbon::now()->timestamp . "." . $exploreFileMine[1];

        $img = Image::make($file->getRealPath());
        $img->save(public_path('/storage/'). $path . $convertName);
        $arr["url"] = $path . $convertName;
        $arr["mime"] = $fileMine;
        $arr["extension"] = $fileExt;

        return $arr;
    }

    public function deleteFile($file)
    {
        if (!empty($file) && Storage::exists($file)) Storage::delete($file);
    }
}
