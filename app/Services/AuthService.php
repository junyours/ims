<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    // Your service logic here

    public function userLogin(array $data): User
    {
          $user = User::with('profile')->where('name', $data['name'])->first();

       if (!$user) {
            throw ValidationException::withMessages([
                'name' => ["The provided username doesn't exist."],
            ]);
        }

        if (!Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'password' => ["The provided password is incorrect."],
            ]);
        }

        return $user;
    }

    public function residentLogin(array $data): User
    {
        $user = User::with('profile')->where('email', $data['email'])->first();

        if (!$user) {
            throw ValidationException::withMessages([
                'name' => ["This number is not yet registered."],
            ]);
        }

        return $user;
    }

    public function register(array $data, $request): User
    {
        // Handle file upload
        $filePath = null;
        if ($request->hasFile('identification')) {
            $file = $request->file('identification');
            $filePath = $file->store('identification', 'public');
        }

        // Create user
        $user = User::create([
            'name'           => $data['name'],
            'email'          => $data['email'],
            'password'       => Hash::make('password'),
            'identification' => $filePath,
            'role'           => 'resident',
        ]);

        return $user;
    }

}