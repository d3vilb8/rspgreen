import React from 'react';
import { useForm } from '@inertiajs/react';

const SalaryGenerator = () => {
    // Initialize the form with useForm
    const { data, setData, post, processing, errors, reset } = useForm({
        salary_month: '', // Initial form state
    });

    // Handle form submission
    const handleGenerate = (e) => {
        e.preventDefault();

        // Send a POST request using Inertia's form handling
        post('/generate-salary', {
            onSuccess: () => {
                reset(); // Reset the form on success
            },
        });
    };

    return (
        <div className='w-[30%] shadow-[rgba(60,64,67,0.3)_0px_1px_2px_0px,rgba(60,64,67,0.15)_0px_2px_6px_2px] h-[8rem] mt-8 p-4'>
            <h3>Select salary month</h3>

            {/* Form for salary generation */}
            <form onSubmit={handleGenerate} className='flex space-x-2'>
                <input
                    type="month"
                    value={data.salary_month}
                    onChange={(e) => setData('salary_month', e.target.value)} // Update form data
                />

                {/* Display validation error */}
                {errors.salary_month && <div className="text-red-500">{errors.salary_month}</div>}

                <button type="submit" disabled={processing} className='bg-blue-700 p-2 text-white'>
                    {processing ? 'Generating...' : 'Generate'}
                </button>
            </form>
        </div>
    );
};

export default SalaryGenerator;
