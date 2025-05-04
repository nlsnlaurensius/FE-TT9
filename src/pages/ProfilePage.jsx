import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TickItLogo from '../assets/TickItLogo.svg';
import { useApiClient } from '../api/api';
import { useAuth } from '../context/AuthContext';

function ProfilePage() {
    const { user, logout, setUser } = useAuth();
    const { get, put } = useApiClient();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateError, setUpdateError] = useState(null);
    const [updateSuccess, setUpdateSuccess] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await get('/users/profile'); // Menggunakan endpoint /profile
                if (response && response.data) {
                    setUser(response.data);
                    setNewUsername(response.data.username);
                    setNewEmail(response.data.email);
                } else {
                    setError('Failed to fetch user data.');
                }
            } catch (err) {
                setError('Failed to fetch user data.');
                console.error('Fetch User Data Error:', err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
             setNewUsername(user.username);
             setNewEmail(user.email);
             setLoading(false);
        } else {
            fetchUserData();
        }
    }, [user, get, setUser]);

    const handleUpdateUsername = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        setUpdateError(null);
        setUpdateSuccess(null);

        if (!newUsername.trim()) {
            setUpdateError('Username cannot be empty.');
            setUpdateLoading(false);
            return;
        }

        try {
            const response = await put('/users/account', { username: newUsername.trim() }); // Menggunakan endpoint /account
            if (response && response.data) {
                setUser(response.data);
                setUpdateSuccess('Username updated successfully!');
            } else {
                 setUpdateError('Failed to update username.');
            }
        } catch (err) {
            setUpdateError(err.details || err.message || 'Failed to update username.');
            console.error('Update Username Error:', err);
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleUpdateEmail = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        setUpdateError(null);
        setUpdateSuccess(null);

         if (!newEmail.trim()) {
            setUpdateError('Email cannot be empty.');
            setUpdateLoading(false);
            return;
        }
         if (!/\S+@\S+\.\S+/.test(newEmail.trim())) {
             setUpdateError('Invalid email format.');
             setUpdateLoading(false);
             return;
         }

        try {
            const response = await put('/users/account', { email: newEmail.trim() }); // Menggunakan endpoint /account
             if (response && response.data) {
                 setUser(response.data);
                 setUpdateSuccess('Email updated successfully!');
             } else {
                  setUpdateError('Failed to update email.');
             }
        } catch (err) {
            setUpdateError(err.details || err.message || 'Failed to update email.');
            console.error('Update Email Error:', err);
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        setUpdateError(null);
        setUpdateSuccess(null);

        if (!currentPassword || !newPassword || !confirmNewPassword) {
            setUpdateError('All password fields are required.');
            setUpdateLoading(false);
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setUpdateError('New password and confirmation do not match.');
            setUpdateLoading(false);
            return;
        }

        try {
            const response = await put('/users/account', { // Menggunakan endpoint /account
                currentPassword,
                password: newPassword, // Kirim newPassword sebagai 'password' sesuai backend update function
            });

             if (response && response.message) { // Backend mengembalikan message di respons sukses update password
                 setUpdateSuccess('Password updated successfully!');
                 setCurrentPassword('');
                 setNewPassword('');
                 setConfirmNewPassword('');
             } else {
                  setUpdateError('Failed to update password.');
             }

        } catch (err) {
            setUpdateError(err.details || err.message || 'Failed to update password.');
            console.error('Update Password Error:', err);
        } finally {
            setUpdateLoading(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-gray-100 flex items-center justify-center"><p className="text-gray-600">Loading profile...</p></div>;
    }

    if (error) {
         return <div className="min-h-screen bg-gray-100 flex items-center justify-center"><p className="text-red-500">Error: {error}</p></div>;
    }

    if (!user) {
        return <div className="min-h-screen bg-gray-100 flex items-center justify-center"><p className="text-red-500">User not authenticated.</p></div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
             <nav className="container mx-auto px-4 py-4 flex items-center justify-between bg-white shadow-sm">
                 <Link to="/app" className="flex items-center">
                      <img src={TickItLogo} alt="TickIt Logo" className="h-8 mr-2" />
                      <span className="text-2xl font-bold text-gray-800">TickIt</span>
                 </Link>
                 <div className="flex items-center space-x-4">
                     {user && <span className="text-gray-800 font-semibold">Hello, {user.username}!</span>}
                     <Link to="/profile" className="text-gray-600 hover:text-gray-900 transition duration-300">Profile</Link>
                     <button
                       onClick={logout}
                       className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-300"
                     >
                       Logout
                     </button>
                 </div>
             </nav>

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h1>

                <div className="bg-white p-6 rounded-md shadow mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">User Information</h2>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm font-semibold text-gray-700">Username:</p>
                            <p className="text-gray-800 text-lg">{user.username}</p>
                        </div>
                         <div>
                            <p className="text-sm font-semibold text-gray-700">Email:</p>
                            <p className="text-gray-800 text-lg">{user.email}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-md shadow">
                     <h2 className="text-xl font-semibold text-gray-800 mb-4">Update Profile</h2>

                     {updateError && <p className="text-red-500 text-sm mb-4">{updateError}</p>}
                     {updateSuccess && <p className="text-green-500 text-sm mb-4">{updateSuccess}</p>}

                    <form onSubmit={handleUpdateUsername} className="mb-6 pb-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">Update Username</h3>
                        <div className="mb-4">
                            <label htmlFor="newUsername" className="block text-sm font-semibold text-gray-700 mb-1">New Username</label>
                            <input
                                type="text"
                                id="newUsername"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-tickitGreen-500"
                                placeholder="Enter new username"
                                required
                                disabled={updateLoading}
                            />
                        </div>
                        <button
                            type="submit"
                            className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ${updateLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={updateLoading}
                        >
                            {updateLoading ? 'Updating...' : 'Update Username'}
                        </button>
                    </form>

                    <form onSubmit={handleUpdateEmail} className="mb-6 pb-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">Update Email</h3>
                        <div className="mb-4">
                            <label htmlFor="newEmail" className="block text-sm font-semibold text-gray-700 mb-1">New Email</label>
                            <input
                                type="email"
                                id="newEmail"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-tickitGreen-500"
                                placeholder="Enter new email"
                                required
                                disabled={updateLoading}
                            />
                        </div>
                        <button
                            type="submit"
                            className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ${updateLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={updateLoading}
                        >
                            {updateLoading ? 'Updating...' : 'Update Email'}
                        </button>
                    </form>

                    <form onSubmit={handleUpdatePassword}>
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">Update Password</h3>
                        <div className="mb-4">
                            <label htmlFor="currentPassword" className="block text-sm font-semibold text-gray-700 mb-1">Current Password</label>
                            <input
                                type="password"
                                id="currentPassword"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-tickitGreen-500"
                                placeholder="Enter current password"
                                required
                                disabled={updateLoading}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-tickitGreen-500"
                                placeholder="Enter new password"
                                required
                                disabled={updateLoading}
                            />
                        </div>
                         <div className="mb-6">
                            <label htmlFor="confirmNewPassword" className="block text-sm font-semibold text-gray-700 mb-1">Confirm New Password</label>
                            <input
                                type="password"
                                id="confirmNewPassword"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-tickitGreen-500"
                                placeholder="Confirm new password"
                                required
                                disabled={updateLoading}
                            />
                        </div>
                        <button
                            type="submit"
                            className={`bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300 ${updateLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={updateLoading}
                        >
                            {updateLoading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>

                </div>

            </div>
        </div>
    );
}

export default ProfilePage;
