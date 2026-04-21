import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { createPageUrl } from '@/utils';

export default function AuthCallback() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const returnTo = params.get('return_to') || createPageUrl('Home');
    if (isAuthenticated) {
      navigate(returnTo, { replace: true });
    } else {
      const check = async () => {
        try {
          const response = await fetch('/api/auth/me', { credentials: 'include' });
          if (response.ok) {
            navigate(returnTo, { replace: true });
            return;
          }
        } catch (error) {
          // ignore
        }
        navigate(createPageUrl('Login'), { replace: true });
      };
      check();
    }
  }, [isAuthenticated, location.search, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
    </div>
  );
}
