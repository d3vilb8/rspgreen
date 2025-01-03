<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Artisan;
use App\Http\Controllers\DealController;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\IncomeController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SalaryController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\BillingController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\HolidayController;
use App\Http\Controllers\PaySlipController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\RolsAndPermission;
use App\Http\Controllers\ContractController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\EstimateController;
use App\Http\Controllers\ComplaintController;
use App\Http\Controllers\LeadStageController;
use App\Http\Controllers\QuotationController;
use App\Http\Controllers\TimesheetController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\DesignatonController;
use App\Http\Controllers\LeadSourceController;
use App\Http\Controllers\DailyStatusController;
use App\Http\Controllers\HolidayWorkController;
use App\Http\Controllers\ChartAccountController;
use App\Http\Controllers\JournalEntryController;
use App\Http\Controllers\EmpolyeeSetupController;
use App\Http\Controllers\ProductServiceController;
use App\Http\Controllers\StageOfProjectController;
use App\Http\Controllers\LeaveManagementController;
use App\Http\Controllers\NotificationAllController;
use App\Http\Controllers\ServiceCategoryController;
use Flasher\Prime\Test\Constraint\NotificationCount;

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::middleware('check_permission')->group(function () {
   


        Route::get('/', [AdminController::class, 'index']);
        Route::get('/employees', [EmployeeController::class, 'index'])->name('employees');
        Route::get('/employees-create', [EmployeeController::class, 'create'])->name('employees-create');
        Route::post('/employees-store', [EmployeeController::class, 'store']);
        Route::get('/employees-edit/{id}', [EmployeeController::class, 'edit'])->name('employees-edit');
        Route::get('/screenshot/employee', [EmployeeController::class, 'screenshot']);
        Route::get('/workhours/employee', [EmployeeController::class, 'workhours']);
        Route::post('/employees-update/{id}', [EmployeeController::class, 'update']);
        Route::get('/employees-destroy/{id}', [EmployeeController::class, 'destroy']);
        // Route::get('/holiday-location',[HolidayWorkController::class,'holidayLocation']);
        // Route::get('holidays-calender',[HolidayWorkController::class,'holidayCalender']);
        Route::get('/projects', [ProjectController::class, 'index'])->name('projects');
        Route::get('/projects-create', [ProjectController::class, 'create']);
        Route::post('/projects-store', [ProjectController::class, 'store']);
        Route::get('/projects-edit/{id}', [ProjectController::class, 'edit']);
        Route::post('/projects-update/{id}', [ProjectController::class, 'update']);
        Route::get('/projects-delete/{id}', [ProjectController::class, 'destroy']);
        Route::get('/projects-show/{id}', [ProjectController::class, 'show']);
        Route::get('/attendance', [AttendanceController::class, 'index'])->name('attandance');
        Route::post('/attendance', [AttendanceController::class, 'index'])->name('attandance');
        //holiday-locationwise
        Route::get('/holidays-location', [HolidayController::class, 'index']);
        Route::post('/holidays-location', [HolidayController::class, 'store']);
        Route::put('/holidays-location/{id}', [HolidayController::class, 'update']);
        Route::delete('/holidays-location/{id}', [HolidayController::class, 'destroy']);
        Route::get('/holiday-all-location', [HolidayController::class, 'listLocation']);
        Route::post('/holiday-all-location', [HolidayController::class, 'storeLocation']);
        Route::put('/holiday-all-location/{id}', [HolidayController::class, 'updateLocation']);
        Route::delete('/holiday-all-location/{id}', [HolidayController::class, 'deleteLocation']);


        //calender holidays
        Route::get('/holidays-calender', [HolidayController::class, 'HolidayCalender']);

        Route::get('/projects-task', [ProjectController::class, 'Task']);
        Route::get('/task-create', [ProjectController::class, 'taskCreate']);

        Route::get('/task-category', [ProjectController::class, 'Tskcategory']);



        Route::get('/leave-type', [LeaveManagementController::class, 'leavType']);
        Route::post('/leave-store', [LeaveManagementController::class, 'leaveStore']);
        Route::post('/leave-update/{id}', [LeaveManagementController::class, 'leaveUpdate']);



        Route::get('/leave-index', [LeaveManagementController::class, 'leave']);
        Route::get('/leave-create', [LeaveManagementController::class, 'leavecreate']);



        Route::get('/leave-store-edit/{id}', [LeaveManagementController::class, 'leaveEdit']);



        Route::get('/holi-day', [TimesheetController::class, 'Holidayindex']);
        Route::post('/holi-store', [TimesheetController::class, 'Holiday']);

        Route::post('/task-update/{id}', [ProjectController::class, 'Taskupdate']);

        Route::get('/task-delete/{id}', [ProjectController::class, 'Taskdestroy']);
    });

    Route::post('/timesheets-status', [TimesheetController::class, 'Statuschange']);
    Route::get('/getProjectTasks', [DailyStatusController::class, 'getProjectTasks'])->name('getProjectTasks');
    Route::post('/leave-approve/{id}', [LeaveManagementController::class, 'leaveStatusApprove']);
    Route::post('/leave-reject/{id}', [LeaveManagementController::class, 'leaveStatusReject']);
    Route::post('/bulk/delete', [EmployeeController::class, 'deleteImage']);


    Route::post('/leave-store-data', [LeaveManagementController::class, 'leavestoredata']);
    Route::post('/leave-store-update/{id}', [LeaveManagementController::class, 'leaveUpdatePost']);
    Route::get('/leave-store-delete/{id}', [LeaveManagementController::class, 'leaveDeletes']);
    Route::post('/holi-update/{id}', [TimesheetController::class, 'HolidayUpdate']);
    Route::get('/holi-delete/{id}', [TimesheetController::class, 'DeleteHoliday']);
    Route::get('/holidays', [ReportController::class, 'reportView']);
    Route::get('/holidays-fetch', [TimesheetController::class, 'Holidayfetch']);
    Route::get('/task-edit/{id}', [ProjectController::class, 'Taskedit']);
    Route::get('/daily-status', [DailyStatusController::class, 'index'])->name('daily-status');
    Route::get('/timesheetemp/{week}/{id}', [EmployeeController::class, 'EmployeeIdtime']);
    Route::get('/timesheetemp-employee/{id}', [EmployeeController::class, 'fetchidwithemployee']);
    Route::post('/timesheetemp-employee-status/{id}', [EmployeeController::class, 'Statuschange']);
    Route::get('/holiday-assign/{id}', [EmployeeController::class, 'holidayAssignd']);
    Route::post('/assign-holiday-work', [HolidayWorkController::class, 'store']);
    Route::put('/update-holiday-work/{id}', [HolidayWorkController::class, 'update']);
    Route::delete('/delete-holiday-work/{id}', [HolidayWorkController::class, 'destroy']);
});
Route::post('/task-category-store/', [ProjectController::class, 'TaskcategoryStore']);

Route::get('/task-category-delete/{id}', [ProjectController::class, 'TaskcategoryDestroy']);
// Route::get('projects', [AdminController::class, 'countProject']);
Route::get('/project-task-assign', [ProjectController::class, 'Taskassign']);
Route::post('/project-task-status/{id}', [ProjectController::class, 'changestatus']);
Route::get('/reports', [ReportController::class, 'index']);
Route::get('/reports-get', [ReportController::class, 'reportView'])->name('reports-get');
Route::post('/task-store', [ProjectController::class, 'taskStore']);
Route::get('/taskcalendar', [ProjectController::class, 'taskcalendar']);
Route::get('/timesheets/{week}', [TimesheetController::class, 'index']);
Route::get('/taskcalendar', [ProjectController::class, 'taskcalendar']);

Route::get('/timesheets/{timesheet}', [TimesheetController::class, 'show']);
Route::put('/timesheets/{timesheet}', [TimesheetController::class, 'update']);
Route::delete('/timesheets/{timesheet}', [TimesheetController::class, 'destroy']);
Route::get('/leave-delete/{id}', [LeaveManagementController::class, 'leaveDelete']);
Route::get('/roles-permission', [RolsAndPermission::class, 'Permmissions']);
Route::post('/roles-permission-store', [RolsAndPermission::class, 'store']);
Route::get('/roles-permission-details', [RolsAndPermission::class, 'Roles']);
Route::get('/roles-permission-edit/{id}', [RolsAndPermission::class, 'edit']);
Route::post('/roles-permission-update/{id}', [RolsAndPermission::class, 'update']);
Route::get('/dashboard', [AdminController::class, 'Dashboard'])->name('dashboard');
Route::get('/unauthorized', [RolsAndPermission::class, 'unauthorized'])->name('unauthorized');
Route::get('notif', [AdminController::class, 'notif'])->name('notif');

require __DIR__ . '/auth.php';
Route::post('/timesheets-store', [TimesheetController::class, 'store']);
Route::get('/timesheets-time', [DailyStatusController::class, 'tasktime']);
// Route::get('/timesheets-time/{taskid}', [DailyStatusController::class, 'tasktime']);
Route::get('/csrf-token', function () {
    return ['csrf_token' => csrf_token()];
});
Route::get('/test', [TestController::class, 'index'])->name('test');
// Route::get('/trigger-status-submit', function () {
//     Artisan::call('status:submit');
//     return 'Status submission triggered.';
// });

Route::get('permission_create', [RolsAndPermission::class, 'permission_create']);
Route::post('readta/{id}', [AdminController::class, 'markAsRead']);
Route::get('getNotificationsWithDetails', [AdminController::class, 'getUserNotificationsWithProject']);
Route::get('/reports/export', [ReportController::class, 'export'])->name('report.export');
Route::post('updateEstimateHours/{id}', [AdminController::class, 'updateEstimateHours'])->name('updateEstimateHours');
Route::post('updateEstimateemp/{id}', [AdminController::class, 'TaskAssignUpdate'])->name('TaskAssignUpdate');
Route::post('/check-leave-days', [LeaveManagementController::class, 'checkLeaveDays']);
Route::get('/getProjectTasksEmployess/{id}', [LeaveManagementController::class, 'getProjectTasksEmployess']);
Route::get('/timesheets/{week}/{id}', [TimesheetController::class, 'employeeindex']);
Route::get('/timesheets-time/{id}', [DailyStatusController::class, 'employeetasktime']);
Route::get('/holiday-details/', [HolidayWorkController::class, 'HolidayAssign']);
Route::get('/notifications-get/', [NotificationAllController::class, 'Notification']);
Route::get('/taskstatus/', [ProjectController::class, 'TaskStatus']);
//Route::get('/task-status', [TaskStatusController::class, 'index']);
Route::post('/task-status/store', [ProjectController::class, 'taskstatusstore']);
Route::put('/task-status/update/{id}', [ProjectController::class, 'taskstatuupdate']);
Route::delete('/task-status/delete/{id}', [ProjectController::class, 'taskstatudestroy']);
Route::post('/task-category-update/{id}', [ProjectController::class, 'TaskcategoryUpdate']);
Route::get('/project-tasks/{id}/total-hours', [ProjectController::class, 'getTotalTaskHours']);



Route::post('/phonepe/initiate', [\App\Http\Controllers\PhonePeController::class, 'phonePe'])->name('phonepe.initiate');
Route::get('/phonepe/callback', [\App\Http\Controllers\PhonePeController::class, 'response'])->name('phonepe.callback');
// routes/api.php (if you're using API routes)
Route::get('/timesheets-delete/{id}', [TimesheetController::class, 'destroyTime']);
Route::get('/totalworkingtime', [AdminController::class, 'TotalTime']);
Route::get('/assign-employee', [ReportController::class, 'AssignEmployee']);
Route::get('/assign-employeeproject', [ProjectController::class, 'proassignemployess']);
Route::post('/approvetime/{id}', [EmployeeController::class, 'ApproveStatuschange']);
Route::post('/rejectapprovetime/{id}', [EmployeeController::class, 'RejectStatuschange']);
// Route::get('/employee-department', [EmployeeController::class, 'employeesetip']);
Route::resource('branches', EmpolyeeSetupController::class);
Route::post('branches-update/{id}', [EmpolyeeSetupController::class, 'update']);
Route::resource('departments', DepartmentController::class);
Route::resource('branches', EmpolyeeSetupController::class);
// Route::post('branches-transfer/{id}', [EmpolyeeSetupController::class, 'transfer']);
Route::post('/branches-transfer/{branchId}', [EmpolyeeSetupController::class, 'transferEmployees']);
// Add a new route for deletion with transfer
// Route::post('/branches/{id}/delete', [EmpolyeeSetupController::class, 'destroyWithTransfer']);


Route::post('departments/{id}', [DepartmentController::class, 'update']);
Route::resource('designations', DesignatonController::class);
Route::post('designations-up/{id}', [DesignatonController::class, 'update']);
Route::resource('payslips', PaySlipController::class);
Route::resource('documents', DocumentController::class);
// Route::get('attendances', [AttendanceController::class, 'index']);
Route::resource('attendances', AttendanceController::class);
Route::get('/payroll', [ReportController::class, 'payroll']);
Route::post('/payroll/store/{id}', [ReportController::class, 'payrollStore']);

Route::get('/salaries', [SalaryController::class, 'index']);
Route::post('/generate-salary', [SalaryController::class, 'generateForAll']);
Route::resource('/clients', ClientController::class,);
Route::get('/tax', [AccountController::class, 'tax']);
Route::post('/tax-store', [AccountController::class, 'taxstore']);
Route::put('/tax-update/{tax}', [AccountController::class, 'taxupdate']);
Route::delete('/tax-delete/{tax}', [AccountController::class, 'taxdestroy']);
Route::get('/expense', [ExpenseController::class, 'index']);
Route::get('/account/category', [AccountController::class, 'AccountCategory']);
Route::post('/account/category/store', [AccountController::class, 'Accountstore']);
Route::post('/account/category/update/{accountCategory}', [AccountController::class, 'Accountupdate']);
Route::delete('/account/category/delete/{accountCategory}', [AccountController::class, 'Accountdestroy']);

Route::get('account/unit', [AccountController::class, 'unit']);
Route::post('account/unit/store', [AccountController::class, 'unitstore']);
Route::post('account/unit/update/{unit}', [AccountController::class, 'unitupdate']);
Route::delete('account/unit/delete/{unit}', [AccountController::class, 'unitdestroy']);


Route::get('account/accountTypes', [AccountController::class, 'accountType']);
Route::post('account/accountTypes/store', [AccountController::class, 'accountTypesstore']);
Route::post('account/accountTypes/update/{accountType}', [AccountController::class, 'accountTypesupdate']);
Route::delete('account/accountTypes/delete/{accountType}', [AccountController::class, 'accountTypesdestroy']);

Route::resource('billing', BillingController::class);
Route::get('suppliers', [UserController::class, 'supplier']);
Route::post('suppliers', [UserController::class, 'supplierstore']);
Route::post('suppliers/delete/{supplier}', [UserController::class, 'supplierdestroy']);
Route::post('suppliers/update/{supplier}', [UserController::class, 'supplierupdate']);

Route::resource('product-services', ProductServiceController::class);
Route::post('product-services/{id}', [ProductServiceController::class, 'update']);
Route::resource('chart-accounts', ChartAccountController::class);
Route::resource('journals', JournalEntryController::class);
Route::get('/sales', [SaleController::class, 'index'])->name('sales.index');
Route::get('/sales/add', [SaleController::class, 'create'])->name('sales.create');
Route::post('/sales/store', [SaleController::class, 'store'])->name('sales.store');
Route::get('/sales/{id}/edit', [SaleController::class, 'edit'])->name('sales.edit');
Route::get('/sales/{id}/print', [SaleController::class, 'printSales'])->name('sale.print');
Route::put('/sales/{id}/edit', [SaleController::class, 'update']);
Route::delete('/sales/{id}/delete', [SaleController::class, 'destroy'])->name('sales.destroy');
Route::resource('service-categories', ServiceCategoryController::class);
// Route::get('/service-categories', [ServiceCategoryController::class, 'index']);
Route::resource('/complaint', ComplaintController::class);
Route::resource('/expense', ExpenseController::class);
Route::get('amc-expense', [IncomeController::class, 'tblexpensecreate']);
Route::get('amc-expense-index', [IncomeController::class, 'tblindex']);
Route::post('amc-expense-create', [IncomeController::class, 'tblexpensestore']);
Route::get('amc-expense/{id}', [IncomeController::class, 'tblexpenseedit']);
Route::post('amc-expense-update/{id}', [IncomeController::class, 'tblexpenseupdate']);
Route::delete('amc-expense-delete/{id}', [IncomeController::class, 'tblexpensedelete']);
Route::resource('/income', IncomeController::class);
Route::get('/income/{id}/edit', [IncomeController::class, 'edit']);
Route::resource('estimate', EstimateController::class);
Route::resource('/Quotation', QuotationController::class);
Route::get('/Get-Customer/{id}', [QuotationController::class, 'getCustomer']);
Route::get('/getproduct', [QuotationController::class, 'getproduct']);
Route::get('/gettaxoptions', [QuotationController::class, 'gettaxoptions']);
Route::get('/quotation-print/{id}', [QuotationController::class, 'Print']);


// Route::get('/upload-documents/{id}',[CustomerController::class,'uploadDoc'])
// Route::get('/upload-documents-table',[CustomerController::class,'uploadTable']);

Route::get('/upload-documents/{id}', [CustomerController::class, 'uploadTable'])->name('upld');
Route::get('/project-info', [CustomerController::class, 'uploadTable']);
Route::get('/view-project', [CustomerController::class, 'viewProject']);
Route::get('/payment-data', [CustomerController::class, 'paymentData']);
// Route::resource('/project-all-stages', StageOfProjectController::class);
Route::get('/project-all-stages', [StageOfProjectController::class, 'index']);
Route::post('/project-all-stages', [StageOfProjectController::class, 'store']);
Route::put('/project-all-stages/{stage}', [StageOfProjectController::class, 'update']);
Route::delete('/project-all-stages/{stage}', [StageOfProjectController::class, 'destroy']);


Route::post('/upload-documents/{id}', [CustomerController::class, 'storeDocument']);

Route::delete('/delete-document/{id}', [CustomerController::class, 'deleteDocument']);

Route::post('/upload', [AdminController::class]);
Route::resource('/lead', LeadController::class);
// Route::post('/lead/{id}/view',[LeadController::class,'viewDetails']);
Route::match(['get', 'post'], '/lead/{id}/view', [LeadController::class, 'viewDetails']);


Route::post('/lead/assign', [LeadController::class, 'assign'])->name('lead.assign');

Route::resource('deal', DealController::class);
Route::resource('contract', ContractController::class);
Route::post('/bulk/download', [EmployeeController::class, 'downloadImages']);
Route::get('/download/{fileName}', [EmployeeController::class, 'downloadFile'])->name('download.file');
Route::get('employees/show/{id}', [EmployeeController::class, 'show']);
Route::get('leave/show/{id}', [LeaveManagementController::class, 'show']);
// Route::get('upload-documents/{id}',[AdminController::class,'']);
// Route::get('lead/addStage', [LeadStageController::class, 'index'])->name('lead/addStage');
Route::resource('lead-sources', LeadSourceController::class);
// Route::resource('lead-stages', LeadStageController::class);
Route::get('lead/addStage', [LeadStageController::class, 'index'])->name('lead/addStage');
Route::resource('lead-stages', LeadStageController::class);
