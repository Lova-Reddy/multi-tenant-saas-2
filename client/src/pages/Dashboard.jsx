
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <h1 className="text-xl font-bold">Partnr SaaS</h1>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <button onClick={handleLogout} className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus:text-gray-900">Logout</button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="py-10">
                <main>
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="px-4 py-8 sm:px-0">
                            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex flex-col items-center justify-center">
                                <h2 className="text-2xl font-semibold text-gray-700">Welcome, {user.email}</h2>
                                <p className="mt-2 text-gray-600">Role: {user.role}</p>
                                {user.domain && <p className="mt-2 text-gray-600">Tenant Domain: {user.domain}</p>}
                                <p className="mt-4 text-gray-500">This is your Multi-Tenant Dashboard.</p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Dashboard;
