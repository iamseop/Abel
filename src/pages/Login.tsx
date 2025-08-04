import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../integrations/supabase/client';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--background-start) 0%, var(--background-mid) 50%, var(--background-end) 100%)' }}>
      <div className="glass-card p-6 sm:p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] text-center mb-6">Abel Co. 로그인</h2>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="dark"
          providers={['google']}
          redirectTo={window.location.origin}
        />
      </div>
    </div>
  );
};

export default Login;