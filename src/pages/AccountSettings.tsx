import React, { useState, useEffect } from 'react';
import { User, Camera, Lock, Save, AlertCircle } from 'lucide-react';
import { useSession } from '../components/SessionContextProvider';
import { supabase } from '../integrations/supabase/client';
import { showSuccess, showError } from '../utils/toast';

const AccountSettings: React.FC = () => {
  const { session } = useSession();
  const user = session?.user;

  const [nickname, setNickname] = useState('');
  const [currentPassword, setCurrentPassword] = useState(''); // 기존 비밀번호 상태 추가
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [isNicknameLoading, setIsNicknameLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isAvatarLoading, setIsAvatarLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setNickname(user.user_metadata?.full_name || user.email || '');
      setAvatarUrl(user.user_metadata?.avatar_url || null);
    }
  }, [user]);

  const handleNicknameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsNicknameLoading(true);
    const { data, error } = await supabase.auth.updateUser({
      data: { full_name: nickname }
    });

    if (error) {
      showError(`닉네임 변경 실패: ${error.message}`);
    } else {
      showSuccess('닉네임이 성공적으로 변경되었습니다.');
      // 세션이 업데이트되면 Header에서도 자동으로 반영됩니다.
    }
    setIsNicknameLoading(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (newPassword !== confirmPassword) {
      showError('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
      return;
    }
    if (newPassword.length < 6) {
      showError('비밀번호는 6자 이상이어야 합니다.');
      return;
    }
    if (!user.email) {
      showError('이메일로 가입한 계정이 아닙니다. 비밀번호 변경을 지원하지 않습니다.');
      return;
    }

    setIsPasswordLoading(true);

    // 1. 기존 비밀번호 검증 (재인증 시도)
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (signInError) {
      showError('기존 비밀번호가 올바르지 않습니다.');
      setIsPasswordLoading(false);
      return;
    }

    // 2. 기존 비밀번호 검증 성공 시 새 비밀번호로 업데이트
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (updateError) {
      showError(`비밀번호 변경 실패: ${updateError.message}`);
    } else {
      showSuccess('비밀번호가 성공적으로 변경되었습니다.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
    setIsPasswordLoading(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleAvatarUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !avatarFile) {
      showError('프로필 사진 파일을 선택해주세요.');
      return;
    }

    setIsAvatarLoading(true);
    const fileExt = avatarFile.name.split('.').pop();
    const fileName = `${user.id}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, avatarFile, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      showError(`사진 업로드 실패: ${uploadError.message}`);
      setIsAvatarLoading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);
    
    const publicUrl = publicUrlData.publicUrl;

    const { error: updateError } = await supabase.auth.updateUser({
      data: { avatar_url: publicUrl }
    });

    if (updateError) {
      showError(`프로필 사진 URL 업데이트 실패: ${updateError.message}`);
    } else {
      setAvatarUrl(publicUrl);
      setAvatarFile(null);
      showSuccess('프로필 사진이 성공적으로 변경되었습니다.');
    }
    setIsAvatarLoading(false);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-[var(--text-primary)]">계정 설정</h1>

      {/* 닉네임 변경 */}
      <div className="glass-card p-4 sm:p-6">
        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">닉네임 변경</h2>
        <form onSubmit={handleNicknameChange} className="space-y-3">
          <div>
            <label htmlFor="nickname" className="block text-xs font-medium text-[var(--text-tertiary)] mb-2">
              닉네임
            </label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full p-3 bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:border-[var(--input-focus-border)] focus:outline-none placeholder:text-[var(--input-placeholder)]"
              placeholder="새 닉네임을 입력하세요"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isNicknameLoading || !nickname.trim()}
            className="w-full py-3 bg-[var(--button-primary-bg)] hover:bg-[var(--button-primary-hover-bg)] disabled:bg-[var(--button-default-bg)] disabled:text-[var(--text-secondary)] text-[var(--text-primary)] font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <User className="w-4 h-4" />
            {isNicknameLoading ? '변경 중...' : '닉네임 변경'}
          </button>
        </form>
      </div>

      {/* 프로필 사진 변경 */}
      <div className="glass-card p-4 sm:p-6">
        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">프로필 사진 변경</h2>
        <form onSubmit={handleAvatarUpload} className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-[var(--input-background)] flex items-center justify-center overflow-hidden border border-[var(--input-border)]">
              {avatarUrl ? (
                <img src={avatarUrl} alt="프로필" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-[var(--text-secondary)]" />
              )}
            </div>
            <label htmlFor="avatar" className="cursor-pointer px-4 py-2 bg-[var(--button-default-bg)] hover:bg-[var(--button-default-hover-bg)] text-[var(--button-default-text)] rounded-lg transition-colors text-sm">
              사진 선택
              <input
                type="file"
                id="avatar"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>
          {avatarFile && (
            <p className="text-[var(--text-tertiary)] text-sm">선택된 파일: {avatarFile.name}</p>
          )}
          <button
            type="submit"
            disabled={isAvatarLoading || !avatarFile}
            className="w-full py-3 bg-[var(--button-primary-bg)] hover:bg-[var(--button-primary-hover-bg)] disabled:bg-[var(--button-default-bg)] disabled:text-[var(--text-secondary)] text-[var(--text-primary)] font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Camera className="w-4 h-4" />
            {isAvatarLoading ? '업로드 중...' : '프로필 사진 업로드'}
          </button>
        </form>
      </div>

      {/* 비밀번호 변경 */}
      <div className="glass-card p-4 sm:p-6">
        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">비밀번호 변경</h2>
        <form onSubmit={handlePasswordChange} className="space-y-3">
          <div>
            <label htmlFor="current-password" className="block text-xs font-medium text-[var(--text-tertiary)] mb-2">
              기존 비밀번호
            </label>
            <input
              type="password"
              id="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-3 bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:border-[var(--input-focus-border)] focus:outline-none placeholder:text-[var(--input-placeholder)]"
              placeholder="기존 비밀번호를 입력하세요"
              required
            />
          </div>
          <div>
            <label htmlFor="new-password" className="block text-xs font-medium text-[var(--text-tertiary)] mb-2">
              새 비밀번호
            </label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:border-[var(--input-focus-border)] focus:outline-none placeholder:text-[var(--input-placeholder)]"
              placeholder="새 비밀번호 (6자 이상)"
              required
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-xs font-medium text-[var(--text-tertiary)] mb-2">
              비밀번호 확인
            </label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:border-[var(--input-focus-border)] focus:outline-none placeholder:text-[var(--input-placeholder)]"
              placeholder="새 비밀번호 다시 입력"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isPasswordLoading || !currentPassword || !newPassword || !confirmPassword}
            className="w-full py-3 bg-[var(--button-primary-bg)] hover:bg-[var(--button-primary-hover-bg)] disabled:bg-[var(--button-default-bg)] disabled:text-[var(--text-secondary)] text-[var(--text-primary)] font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            {isPasswordLoading ? '변경 중...' : '비밀번호 변경'}
          </button>
        </form>
      </div>

      <div 
        className="glass-card p-4 sm:p-6"
        style={{ background: 'linear-gradient(to right, var(--gradient-info-blue-start), var(--gradient-info-blue-end))' }}
      >
        <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)] mb-3 sm:mb-4">💡 계정 설정 팁</h3>
        <div className="space-y-2 text-[var(--text-tertiary)] text-xs">
          <p>• 닉네임은 다른 사용자에게 표시되는 이름입니다.</p>
          <p>• 프로필 사진은 계정을 시각적으로 식별하는 데 도움이 됩니다.</p>
          <p>• 비밀번호는 주기적으로 변경하여 계정 보안을 강화하세요.</p>
          <p className="text-[var(--text-accent-red)] flex items-center gap-1">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            비밀번호 변경 후에는 다시 로그인해야 할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;