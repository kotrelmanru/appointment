import React, { useState, useContext } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/inputs/input';
import { UserContext } from '../../context/UserContext';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { GiCircuitry } from 'react-icons/gi';
import { FiUser, FiClock } from 'react-icons/fi';

// A curated list of common IANA timezones
const TIMEZONES = [
  'Asia/Jakarta',
  'Asia/Makassar',
  'Asia/Jayapura',
  'America/New_York',
  'Europe/London',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Australia/Sydney',
  'Pacific/Auckland',
  // add more as needed
];

const SignUp = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [timezone, setTimezone] = useState('Asia/Jakarta');
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name) return setError('Please enter your name');
    if (!username) return setError('Please enter a username');

    setError('');

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name,
        username,
        preferred_timezone: timezone,
      });

      const { token, user } = response.data;
      if (token) {
        localStorage.setItem('token', token);
        updateUser(user);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong, please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center items-center space-x-2">
            <GiCircuitry className="text-cyan-400 w-8 h-8" />
            <h1 className="text-3xl font-bold tracking-wide text-cyan-400">Appointments MS</h1>
          </div>
        </div>
        
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-cyan-600">
          <h2 className="text-xl font-semibold text-cyan-400 mb-6 text-center">Membuat Akun</h2>
          
          <form onSubmit={handleSignUp} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-cyan-300 mb-1">
                Nama
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={({ target }) => setName(target.value)}
                required
                placeholder="masukkan nama anda"
                className="w-full bg-gray-700 border border-cyan-600 rounded-md py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-cyan-300 mb-1">
                Nama Pengguna
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
                required
                placeholder="masukkan nama pengguna anda"
                className="w-full bg-gray-700 border border-cyan-600 rounded-md py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="timezone" className="block text-sm font-medium text-cyan-300 mb-1 flex items-center">
                <FiClock className="mr-1 text-cyan-400" />
                Zona Waktu
              </label>
              <select
                id="timezone"
                name="timezone"
                value={timezone}
                onChange={({ target }) => setTimezone(target.value)}
                className="w-full bg-gray-700 border border-cyan-600 rounded-md py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-500 rounded-md p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors duration-200"
              >
                SIGN UP
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Sudah memiliki akun?{' '}
              <Link
                className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors duration-200"
                to="/login"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
        
        <div className="text-center text-xs text-gray-500 mt-4">
          &copy; 2025 Cyber Appointments. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default SignUp;