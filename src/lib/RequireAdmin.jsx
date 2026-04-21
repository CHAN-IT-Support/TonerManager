import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { useI18n } from '@/lib/i18n';

export default function RequireAdmin({ children }) {
  const { isLoadingAuth, isAuthenticated, user } = useAuth();
  const { t } = useI18n();
  const location = useLocation();

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    const returnTo = location.pathname || '/';
    return (
      <Navigate to={`/Login?return_to=${encodeURIComponent(returnTo)}`} replace />
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm max-w-md w-full text-center space-y-4">
          <h2 className="text-xl font-semibold text-slate-800">{t('auth.noAccessTitle')}</h2>
          <p className="text-slate-600">
            {t('auth.noAccessText')}
          </p>
        </div>
      </div>
    );
  }

  return children;
}
