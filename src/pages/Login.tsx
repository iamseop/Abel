import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../integrations/supabase/client';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="glass-card p-6 sm:p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Abel Co. 로그인</h2>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="dark"
          providers={['google']} // 여기에 'google'을 추가했습니다.
          redirectTo={window.location.origin}
        />
      </div>
    </div>
  );
};

export default Login;