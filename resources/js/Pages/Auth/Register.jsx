import React, { useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        password_confirmation: '',
        source: '',
        commission: '', 
        website: '', 
        business_type: '',
        agentname: '', // Add agentname here for the form data
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [termsError, setTermsError] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handleRegisterClick = (e) => {
        e.preventDefault();
        setTermsError(''); 

        if (!termsAccepted) {
            setTermsError('Please accept the terms and conditions to register.');
            return;
        }

        setShowModal(true); 
    };

    const handleModalSubmit = () => {
        setShowModal(false);

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={handleRegisterClick} className="space-y-4">
                {/* Name */}
                <div>
                    <InputLabel htmlFor="name" value="Name" />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="block w-full mt-1"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                {/* Phone */}
                <div>
                    <InputLabel htmlFor="phone" value="Phone Number" />
                    <TextInput
                        id="phone"
                        type="number"
                        name="phone"
                        value={data.phone}
                        className="block w-full mt-1"
                        autoComplete="phone"
                        onChange={(e) => setData('phone', e.target.value)}
                        required
                    />
                    <InputError message={errors.phone} className="mt-2" />
                </div>

                {/* Email */}
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="block w-full mt-1"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                {/* Source Dropdown */}
                <div>
                    <InputLabel htmlFor="source" value="Project" />
                    <select
                        id="source"
                        name="source"
                        value={data.source}
                        onChange={(e) => setData('source', e.target.value)}
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    >
                        <option value="">Select an option</option>
                        <option value="self">Project 1</option>
                        <option value="social media">Project 2</option>
                        <option value="website">Project 3</option>
                        <option value="other">Project 4</option>
                      
                    </select>
                    <InputError message={errors.source} className="mt-2" />
                </div>

                {/* Commission Input for "Agent" Source */}
                {/* {data.source === 'agent' && (
                    <div>
                        <InputLabel htmlFor="agentname" value="Agent Name" />
                        <TextInput
                            id="agentname"
                            name="agentname"
                            type="text"
                            value={data.agentname}
                            className="block w-full mt-1"
                            onChange={(e) => setData('agentname', e.target.value)}
                            required
                        />
                        <InputError message={errors.agentname} className="mt-2" />
                    </div>
                )}

                {/* Website Input for "Website" Source */}
                 {/* {data.source === 'website' && (
                    <div>
                        <InputLabel htmlFor="website" value="Website URL" />
                        <TextInput
                            id="website"
                            name="website"
                            type="url"
                            value={data.website}
                            className="block w-full mt-1"
                            onChange={(e) => setData('website', e.target.value)}
                        />
                        <InputError message={errors.website} className="mt-2" />
                    </div>
                )} */}

                {/* Business Type */}
                <div>
                    <InputLabel htmlFor="business_type" value="Business Type" />
                    <TextInput
                        id="business_type"
                        name="business_type"
                        value={data.business_type}
                        className="block w-full mt-1"
                        onChange={(e) => setData('business_type', e.target.value)}
                        required
                    />
                    <InputError message={errors.business_type} className="mt-2" />
                </div>

                {/* Password */}
                <div className="relative">
                    <InputLabel htmlFor="password" value="Password" />
                    <TextInput
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={data.password}
                        className="block w-full mt-1 pr-12"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 inset-y-0 flex items-center justify-center text-gray-500"
                    >
                        {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                    </button>
                    <InputError message={errors.password} className="mt-2" />
                </div>

                {/* Confirm Password */}
                <div className="relative">
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                    <TextInput
                        id="password_confirmation"
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="block w-full mt-1 pr-12"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-3 inset-y-0 flex items-center justify-center text-gray-500"
                    >
                        {showConfirmPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                    </button>
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                {/* Address */}
                <div>
                    <InputLabel htmlFor="address" value="Address" />
                    <textarea
                        id="address"
                        name="address"
                        value={data.address}
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        onChange={(e) => setData('address', e.target.value)}
                        required
                    />
                    <InputError message={errors.address} className="mt-2" />
                </div>

                {/* Terms & Conditions */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mr-2"
                    />
                    <span className="text-sm">I agree to the terms and conditions.</span>
                </div>
                {termsError && <p className="mt-2 text-sm text-red-600">{termsError}</p>}

                {/* Register Button */}
                <div className="flex items-center justify-end mt-4">
                    <Link
                        href={route('login')}
                        className="text-sm text-gray-600 underline rounded-md hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Already registered?
                    </Link>
                    <PrimaryButton className="ml-4" disabled={processing}>
                        Register
                    </PrimaryButton>
                </div>
            </form>

            {/* Terms and Conditions Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="max-w-lg p-6 bg-white rounded-lg shadow-lg">
                        <h2 className="mb-4 text-lg font-semibold">Terms and Conditions</h2>
                        <p className="mb-4">Please review and accept the terms and conditions to proceed with registration.</p>
                        <div className="flex justify-end space-x-2">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                                onClick={handleModalSubmit}
                            >
                                Accept & Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </GuestLayout>
    );
}
