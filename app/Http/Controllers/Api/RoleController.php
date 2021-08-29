<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Repositories\RoleRepository;

class RoleController extends Controller
{
    protected $roleRepository;

    public function __construct(
        RoleRepository $roleRepository
    ) {
        $this->roleRepository = $roleRepository;
    }

    public function index()
    {
        return response()->json($this->roleRepository->showRole());
    }
}
