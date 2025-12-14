<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class WatchListRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
   public function rules(): array
    {
        return [
            'type' => 'required|in:person,vehicle',
            'identifier' => 'required|string|max:255',
            'details' => 'required|string|max:1000',
            'reason' => 'required|string|max:500',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ];
    }
    /**
     * Custom messages (optional)
     */
    public function messages(): array
    {
        return [
            'type.required' => 'WatchList type is required.',
            'type.in' => 'WatchList type must be either person or vehicle.',
            'identifier.required' => 'Full name or vehicle model is required.',
            'reason.required' => 'Reason is required.',
            'image.image' => 'The uploaded file must be an image.',
            'image.max' => 'Image size should not exceed 2MB.',
        ];
    }
}
