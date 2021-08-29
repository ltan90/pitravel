<?php

namespace App\Traits;

trait DistanceTrait
{
  public function getDistance($lat_hotel, $lng_hotel, $lat_location, $lng_location, $unit)
  {
    if (($lat_hotel == $lat_location) && ($lng_hotel == $lng_location) || !$lat_hotel || !$lng_hotel) return;

    $theta = 0;
    $dist = sin(deg2rad($lat_hotel)) * sin(deg2rad($lat_location)) + cos(deg2rad($lat_hotel)) * cos(deg2rad($lat_location)) * cos(deg2rad($theta));
    $dist = acos($dist);
    $dist = rad2deg($dist);
    $miles = $dist * 60 * 1.1515;
    $unit = strtoupper($unit);

    switch ($unit) {
      case config('constants.DISTANCE_UNIT.KILOMETERS'):
        return ($miles * 1.609344);

      case config('constants.DISTANCE_UNIT.NAUTICAL_MILES'):
        return ($miles * 0.8684);

      default:
        return $miles;
    }
  }
}
