'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('google_id_token');

        if (!token) {
          router.push('/login');
          return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const response = await fetch(`${apiUrl}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const profile = await response.json();
        setUser(profile);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        localStorage.removeItem('google_id_token');
        document.cookie = 'google_id_token=; path=/; max-age=0;';
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem('google_id_token');
    document.cookie = 'google_id_token=; path=/; max-age=0;';
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
          <p className="text-white text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700 mb-6">{error}</p>
          <p className="text-gray-500 text-sm">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <button
            onClick={handleSignOut}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Sign Out
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex items-center gap-6 mb-8">
            {user.avatar && (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-full border-4 border-gray-200"
              />
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Profile Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Name</p>
                <p className="text-gray-900 font-semibold">{user.name}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Email</p>
                <p className="text-gray-900 font-semibold">{user.email}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">User ID</p>
                <p className="text-gray-900 font-mono text-sm truncate">{user.id}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              Welcome to AI Developer Feed! Your authentication is working correctly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
