<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Permission;

class RolsAndPermission extends Controller
{
    public function Permmissions()
    {
        $permissions = Permission::all();
        $user = Auth::user()->name;
        $userss = Auth::user();
        if ($userss) {
            // Ensure permissions are assigned and fetched correctly
            $user_type = $userss->getAllPermissions()->pluck('name')->toArray();
            // dd($permissions);
        }
        // dd($permissions);
        $notif = Auth::user()->notifications;
        return Inertia::render('admin/permissions', compact('permissions', 'user', 'user_type', 'notif'));
        // return view('admin.permissions', compact('permissions'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'role_name' => 'required|string|max:255',
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role = Role::create(['name' => $request->role_name]);
        $role->permissions()->sync($request->permissions);

        return back()->with('success', 'Role created successfully');
    }

    public function Roles()
    {
        $roles = Role::where('id', '!=', 1)->get();
        // $roles = Role::all();
        $user = Auth::user()->name;
        $userss = Auth::user();
        if ($userss) {
            // Ensure permissions are assigned and fetched correctly
            $user_type = $userss->getAllPermissions()->pluck('name')->toArray();
            // dd($permissions);
        }
        $notif = Auth::user()->notifications;
        return Inertia::render('admin/roles', compact('roles', 'user', 'user_type', 'notif'));
        // return view('admin.roles', compact('roles'));
    }

    public function edit($id)
    {
        $role = Role::with('permissions')->findOrFail($id);
        $permissions = Permission::all(); // Assuming you want to pass all permissions for the checkboxes
        $userss = Auth::user();
        $user = Auth::user()->name;
        if ($userss) {
            // Ensure permissions are assigned and fetched correctly
            $user_type = $userss->getAllPermissions()->pluck('name')->toArray();
            // dd($permissions);
        }
        $notif = Auth::user()->notifications;
        return Inertia::render('admin/edit', [
            'role' => $role,
            'permissions' => $permissions,
            'userss' => $userss,
            'user' => $user,
            'user_type' => $user_type,
            'notif' => $notif,
        ]);
    }

    public function update(Request $request, $id)
    {

        $role = Role::findOrFail($id);

        $request->validate([
            'role_name' => 'required|string|max:255',
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role->update(['name' => $request->role_name]);
        $role->permissions()->sync($request->permissions);
        $notif = Auth::user()->notifications;
        return redirect('roles-permission-details')->with('success', 'Role updated successfully');
    }

    public function unauthorized()
    {
        return Inertia::render('admin/unauthorized');
        // return view('admin.unauthorized');
    }
    public function permission_create(Request $request)
    {
        $permission = Permission::create(['name' => 'view_employeelave']);
        dd($permission);
        // return back()->with('success', 'Permission created successfully');
    }
}
