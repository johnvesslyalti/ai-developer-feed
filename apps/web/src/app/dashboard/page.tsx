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
    <div className="min-h-screen bg-black">
      <style>{`
        .dashboard-bg {
          background: linear-gradient(135deg, #111111 0%, #0a0a0a 100%);
        }
        .profile-card {
          background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
          border: 1px solid #333333;
        }
        .feature-card {
          background: rgba(30, 30, 30, 0.5);
          border: 1px solid #333333;
          transition: all 0.3s ease;
        }
        .feature-card:hover {
          background: rgba(40, 40, 40, 0.7);
          border-color: #444444;
        }
        .status-box {
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(109, 40, 217, 0.1) 100%);
          border: 1px solid rgba(59, 130, 246, 0.3);
        }
      `}</style>

      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-950">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">AI Developer Feed</h1>
            <p className="text-gray-500 text-sm mt-1">Early Access</p>
          </div>
          <button
            onClick={handleSignOut}
            className="bg-red-700 hover:bg-red-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-bg min-h-screen">
        <div className="max-w-5xl mx-auto px-6 py-16">
          {/* Profile Card */}
          <div className="profile-card rounded-2xl p-12 mb-12 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center gap-10">
              {user.avatar && (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-40 h-40 rounded-full border-4 border-blue-500 object-cover shadow-lg"
                />
              )}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-5xl font-bold text-white mb-3">{user.name}</h2>
                <p className="text-gray-300 text-xl mb-6">{user.email}</p>
                <div className="inline-flex items-center gap-3 px-5 py-2 bg-green-500 bg-opacity-20 border border-green-500 border-opacity-50 rounded-full">
                  <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-sm text-green-300 font-medium">Access Granted</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Message */}
          <div className="status-box rounded-2xl p-12 mb-12 shadow-lg">
            <div className="text-center">
              <div className="mb-8 flex justify-center">
                <div className="w-16 h-16 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-4xl font-bold text-white mb-6">We've Noted You!</h3>
              <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed mb-8">
                Thanks for getting early access to <span className="font-semibold text-blue-400">AI Developer Feed</span>.
                We're actively building the product and will reach out as soon as it's ready.
                Stay tuned for updates!
              </p>
              <div className="pt-8 border-t border-gray-700">
                <p className="text-gray-400">
                  In the meantime, follow us on{' '}
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 font-medium">
                    X
                  </a>
                  {' '}for updates
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="feature-card rounded-xl p-8">
              <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-semibold text-white text-lg mb-3">Daily Updates</h4>
              <p className="text-gray-400">Fresh content from Hacker News and Dev.to every day</p>
            </div>

            <div className="feature-card rounded-xl p-8">
              <div className="w-12 h-12 bg-purple-500 bg-opacity-20 rounded-lg flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-white text-lg mb-3">Smart Filtering</h4>
              <p className="text-gray-400">AI-powered relevance based on your tech stack</p>
            </div>

            <div className="feature-card rounded-xl p-8">
              <div className="w-12 h-12 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-white text-lg mb-3">Always Free</h4>
              <p className="text-gray-400">Early access is completely free while we build</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
