<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\CreateAccountRequest;
use App\Services\AuthService;
use App\Services\UserService;
use App\Models\User;

class AuthController extends Controller
{
    //
    protected $authService;
    protected $userService;

    public function __construct(AuthService $authService, UserService $userService)
    {
        $this->authService = $authService;
        $this->userService = $userService;
    }

    public function login(LoginRequest $request)
    {
        $user = $this->authService->userLogin($request->validated());

        $token = $user->createToken('auth_token')->plainTextToken;

        return response([
            'message' => 'Login successful.',
            'user' => $user,
            'token' => $token,
        ]);
    }

   public function residentLogin(Request $request)
    {
        $validated = $request->validate([
                'email' => 'required',
                'password' => 'required',
            ]);

        $user = $this->authService->residentLogin($validated);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful.',
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function register(CreateAccountRequest $request)
    {
        $registerUser = $this->userService->createUser($request->validated());

        $token = $registerUser->createToken('auth_token')->plainTextToken;

           return response([
            'message' => 'Login successful.',
            'user' => $registerUser,
            'token' => $token,
        ]);
    }

    public function residentRegistration(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|max:255|unique:users,email',
                'identification' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
            ]);

            // Pass both validated data and the request to the service
            $user = $this->authService->register($validated, $request);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Registration successful.',
                'user' => $user,
                'token' => $token,
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Something went wrong.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function logout()
    {
         auth()->user()->tokens()->delete();

         return response()->json(['message' => 'logout successful']);
    }
    
}
