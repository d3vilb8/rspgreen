<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */

    public function handle(Request $request, Closure $next): Response
    {
        $requiredPermission = $this->getRequiredPermission($request);

        // \Log::info('Checking Permission: ' . $requiredPermission);
        // \Log::info('User Permissions: ' . implode(', ', Auth::user()->getAllPermissions()->pluck('name')->toArray()));

        if ($requiredPermission && Auth::user()->hasPermissionTo(trim($requiredPermission))) {
            return $next($request);
        }

        return redirect()->route('unauthorized');
    }

    /**
     * Determine the required permission based on the request.
     *
     * @param \Illuminate\Http\Request $request
     * @return string
     */
    protected function getRequiredPermission(Request $request): ?string
    {
        // Define permission mapping based on URI or other request attributes
        $permissionMap = [
            'employees' => 'view_employee',
            'screenshot/employee'=>'view_employee',
            'workhours/employee'=>'view_employee',
           
            'employees-edit/employees' => 'view_employee',
            'employees-create' => 'create_employee',
            'employees-store' => 'create_employee',
            'employees-edit/{id}' => 'edit_employee',
            'employees-update/{id}' => 'edit_employee',
            'employees-destroy/{id}' => 'delete_employee',
            'attendance'=>'view_employee',
            'taskcalendar'=>'view_task',
            'projects' => 'view_project',
            'projects-create' => 'create_project',
            'projects-store' => 'create_project',
            'projects-edit/{id}' => 'edit_project',
            'projects-update/{id}' => 'edit_project',
            'projects-show/{id}' => 'view_project',
            'projects-delete/{id}' => 'delete_project',
            'projects-task' => 'view_task',
            'task-create' => 'create_task',
            'task-edit/{id}' => 'edit_task',
            'task-update/{id}' => 'edit_task',
            'task-delete/{id}' => 'delete_task',
            'task-category' => 'view_task_category',
            'task-category-create' => 'create_task_category',
            'task-category-edit' => 'edit_task_category',
            'task-category-delete' => 'delete_task_category',
            'holi-day' => 'view_holiday',
            'holidays-create' => 'create_holiday',
            'holidays-edit' => 'edit_holiday',
            'holidays-delete' => 'delete_holiday',
            'holidays-location'=>'view_holiday',
            'holidays-calender'=>'view_holiday',
            'holidays-calender/{id}'=>'view_holiday',
            "holiday-all-location"=>'view_holiday',

            "holiday-all-location/{id}"=>'view_holiday',
            "holiday-all-location"=>'view_holiday',

            'holi-store' => 'create_holiday',

            'leave-index' => 'view_leave',
            'leave-create' => 'create_leave',
            'leave-update/{id}' => 'edit_leave_type',
            'leave-store' => 'create_leave',
            'leave-store-edit/{id}' => 'edit_leave',
          'delete-document/{id}' => 'delete_leave',
          'upload-documents/{id}'=>'create_leave',
            'leave-store-delete' => 'delete_leave',
            'leave-type' => 'view_leave_type',
            'leave-type-create' => 'create_leave_type',
            'leave-type-edit/{id}' => 'edit_leave_type',
            'leave-type-delete/{id}' => 'delete_leave_type',
            'reports-get' => 'view_report',
            'lead-sources' => 'view_report', 
            'lead-stages' => 'view_report'
 

        ];

        $uri = $request->path();

        foreach ($permissionMap as $pattern => $permission) {
            // Replace dynamic segments with regex patterns
            $pattern = str_replace('{id}', '[0-9]+', $pattern);

            // Add delimiters and check if the URI matches the pattern
            if (preg_match('#^' . $pattern . '$#', $uri)) {
                return $permission;
            }
        }
        // If no permission is found, return null or handle as needed
        return null;
    }
}