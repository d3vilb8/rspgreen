<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        $perms = [
            // 'create_employee',
            // 'edit_employee',
            // 'delete_employee',
            // 'view_employee',
            // 'create_project',
            // 'delete_project',
            // 'view_project',
            // 'edit_project',
            // 'create_task',
            // 'view_task',
            // 'edit_task',
            // 'delete_task',
            // 'create_task_category',
            // 'view_task_category',
            // 'edit_task_category',
            // 'delete_task_category',
            // 'create_holiday',
            // 'view_holiday',
            // 'edit_holiday',
            // 'delete_holiday',
            // 'create_leave',
            // 'view_leave',
            // 'edit_leave',
            // 'delete_leave',
            // 'create_leave_type',
            // 'view_leave_type',
            // 'edit_leave_type',
            // 'delete_leave_type',
            // 'create_report',
            // 'view_report',
            // 'edit_report',
            // 'delete_report',
            // 'create_employee_report',
            // 'view_employee_report',
            // 'edit_employee_report',
            // 'delete_employee_report',
            // 'create_timsheet',
            // 'edit_timesheet',
            // 'create_role',
            // 'edit_role',
            // 'delete_role',
            // 'create_salary',
            // 'edit_salary',
            // 'delete_salary',
            // 'view_salary',
            // 'view_payroll',
            // 'create_payroll',
            // 'edit_payroll',
            // 'delete_payroll',
            // 'view_purchase',
            // 'view_double_entry',
            // 'view_budget',
            // 'view_tax',
            // 'view_leads',
            // 'create_leads',
            // 'edit_leads',
            // 'delete_leads',
            // 'view_deals',
            // 'create_deals',
            // 'edit_deals',
            // 'delete_deals',
            // 'view_service',
            // 'create_service',
            // 'edit_service',
            // 'delete_service',
            'view_attendance',
            'create_contracts',
            'edit_contracts',
            'delete_contracts',
            'view_contracts',

        ];
        foreach ($perms as $perm) {
            Permission::create(['name' => $perm]);
        }
        // $adminRole = Role::create(['name' => 'admin']);

        // Assign all permissions to admin role
        // $adminRole->givePermissionTo(Permission::all());

        // Optionally, assign the admin role to a specific user
        // $user = User::find(1); // Replace with the actual admin user ID
        // if ($user) {
        //     $user->assignRole($adminRole);
        // }
    }
}
