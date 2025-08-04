import React, { useState } from 'react';
import { Bell, Settings, User, LogOut, Calculator, Brain, Bookmark, TrendingUp, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Modal from './Modal';
import { useSession } from '../components/SessionContextProvider';
import { supabase } from '../integrations/supabase/client';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  // activeTab과 onTabChange 프롭은 더 이상 필요하지 않습니다.
}

const Header: React.FC<HeaderProps> = () => {
  const location = useLocation();
  const { session } = useSession();
  const { theme, setTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const notifications = [
    { id: 1, message: '삼성전자가 2.5% 상승했습니다', time: '5분 전' },
    { id: 2, message: '포트폴리오 월간 리포트가 준비되었습니다', time: '1시간 전' },
    { id: 3, message: 'SK하이닉스 실적 발표 예정', time: '2시간 전' }
  ];

  const tabs = [
    { id: 'portfolio', label: '포트폴리오', icon: null, path: '/' },
    { id: 'watchlist', label: '관심종목', icon: Bookmark, path: '/watchlist' },
    { id: 'simulation', label: '모의투자', icon: TrendingUp, path: '/simulation' },
    { id: 'calculator', label: '계산기', icon: Calculator, path: '/calculator' },
    { id: 'personality', label: '투자성향', icon: Brain, path: '/personality' }
  ];

  const handleTabClick = () => {
    setShowMobileMenu(false);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('로그아웃 실패:', error.message);
      alert('로그아웃에 실패했습니다.');
    } else {
      console.log('로그아웃 성공');
      setShowProfile(false);
    }
  };

  const userNickname = session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0] || '사용자';
  const userAvatarUrl = session?.user?.user_metadata?.avatar_url;

  return (
    <>
      <header className="glass-card backdrop-blur-xl border-b border-[var(--card-border)] shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* 로고 */}
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:scale-105 transition-transform"
                onClick={handleTabClick}
                style={{ background: 'linear-gradient(to right, var(--gradient-logo-start), var(--gradient-logo-end))' }}
              >
                <span className="text-white font-bold text-sm">P</span>
              </Link>
              
              {/* 데스크톱 네비게이션 */}
              <nav className="hidden lg:flex gap-1">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  const isActive = location.pathname === tab.path || (tab.path === '/' && location.pathname === '/portfolio');
                  return (
                    <Link
                      key={tab.id}
                      to={tab.path}
                      onClick={handleTabClick}
                      className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 text-sm ${
                        isActive
                          ? 'bg-[var(--button-primary-bg)] text-[var(--text-primary)] shadow-lg'
                          : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--card-background-hover)]'
                      }`}
                    >
                      {IconComponent && <IconComponent className="w-4 h-4" style={{ color: 'var(--text-accent-blue)' }} />}
                      {tab.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
            
            {/* 우측 메뉴 */}
            <div className="flex items-center gap-2">
              {/* 데스크톱 아이콘들 */}
              <div className="hidden md:flex items-center gap-2">
                <button 
                  onClick={() => setShowNotifications(true)}
                  className="p-2 hover:bg-[var(--card-background-hover)] rounded-lg transition-colors relative"
                >
                  <Bell className="w-5 h-5 text-[var(--text-tertiary)]" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>
                <button 
                  onClick={() => setShowSettings(true)}
                  className="p-2 hover:bg-[var(--card-background-hover)] rounded-lg transition-colors"
                >
                  <Settings className="w-5 h-5 text-[var(--text-tertiary)]" />
                </button>
                <button 
                  onClick={() => setShowProfile(true)}
                  className="p-2 hover:bg-[var(--card-background-hover)] rounded-lg transition-colors"
                >
                  <User className="w-5 h-5 text-[var(--text-tertiary)]" />
                </button>
              </div>

              {/* 모바일 햄버거 메뉴 */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 hover:bg-[var(--card-background-hover)] rounded-lg transition-colors"
              >
                {showMobileMenu ? (
                  <X className="w-6 h-6 text-[var(--text-tertiary)]" />
                ) : (
                  <Menu className="w-6 h-6 text-[var(--text-tertiary)]" />
                )}
              </button>
            </div>
          </div>

          {/* 모바일 메뉴 */}
          {showMobileMenu && (
            <>
              {/* 모바일 메뉴 배경 오버레이 */}
              <div 
                className="fixed inset-0 backdrop-blur-sm z-30 lg:hidden"
                style={{ backgroundColor: 'var(--overlay-background)' }}
                onClick={() => setShowMobileMenu(false)}
              />
              
              {/* 모바일 메뉴 컨텐츠 */}
              <div className="lg:hidden mt-4 pb-4 border-t border-[var(--card-border)] pt-4 relative z-40">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    const isActive = location.pathname === tab.path || (tab.path === '/' && location.pathname === '/portfolio');
                    return (
                      <Link
                        key={tab.id}
                        to={tab.path}
                        onClick={handleTabClick}
                        className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-3 text-left ${
                          isActive
                            ? 'bg-[var(--button-primary-bg)] text-[var(--text-primary)] shadow-lg'
                            : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--card-background-hover)]'
                        }`}
                      >
                        {IconComponent && <IconComponent className="w-5 h-5" style={{ color: 'var(--text-accent-blue)' }} />}
                        {tab.label}
                      </Link>
                    );
                  })}
                </nav>
                
                {/* 모바일 액션 버튼들 */}
                <div className="mt-4 pt-4 border-t border-[var(--card-border)]">
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      onClick={() => {
                        setShowNotifications(true);
                        setShowMobileMenu(false);
                      }}
                      className="p-3 hover:bg-[var(--card-background-hover)] rounded-lg transition-colors flex flex-col items-center gap-1 relative"
                    >
                      <Bell className="w-5 h-5 text-[var(--text-tertiary)]" />
                      <span className="text-xs text-[var(--text-tertiary)]">알림</span>
                      <span className="absolute top-1 right-3 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                    <button 
                      onClick={() => {
                        setShowSettings(true);
                        setShowMobileMenu(false);
                      }}
                      className="p-3 hover:bg-[var(--card-background-hover)] rounded-lg transition-colors flex flex-col items-center gap-1"
                    >
                      <Settings className="w-5 h-5 text-[var(--text-tertiary)]" />
                      <span className="text-xs text-[var(--text-tertiary)]">설정</span>
                    </button>
                    <button 
                      onClick={() => {
                        setShowProfile(true);
                        setShowMobileMenu(false);
                      }}
                      className="p-3 hover:bg-[var(--card-background-hover)] rounded-lg transition-colors flex flex-col items-center gap-1"
                    >
                      <User className="w-5 h-5 text-[var(--text-tertiary)]" />
                      <span className="text-xs text-[var(--text-tertiary)]">프로필</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </header>

      <Modal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        title="알림"
        contentClassName="max-w-md" // 알림 모달 크기 조정
      >
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className="p-4 bg-[var(--input-background)] rounded-lg">
              <p className="text-[var(--text-primary)] text-sm">{notification.message}</p>
              <p className="text-[var(--text-secondary)] text-xs mt-1">{notification.time}</p>
            </div>
          ))}
        </div>
      </Modal>

      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="설정"
        contentClassName="max-w-md" // 설정 모달 크기 조정
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[var(--input-background)] rounded-lg">
            <span className="text-[var(--text-primary)]">테마 설정</span>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'abel')}
              className="px-3 py-1.5 bg-[var(--button-default-bg)] border border-[var(--input-border)] rounded-lg text-[var(--button-default-text)] text-sm focus:outline-none focus:border-[var(--input-focus-border)]"
            >
              <option value="abel">Abel 모드</option>
              <option value="light">라이트 모드</option>
              <option value="dark">다크 모드</option>
            </select>
          </div>
          <div className="flex items-center justify-between p-4 bg-[var(--input-background)] rounded-lg">
            <span className="text-[var(--text-primary)]">알림 설정</span>
            <input type="checkbox" defaultChecked className="toggle" />
          </div>
          <div className="flex items-center justify-between p-4 bg-[var(--input-background)] rounded-lg">
            <span className="text-[var(--text-primary)]">자동 새로고침</span>
            <input type="checkbox" className="toggle" />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        title="프로필"
        contentClassName="max-w-md" // 프로필 모달 크기 조정
      >
        <div className="space-y-4">
          <div className="text-center">
            <div 
              className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden"
              style={{ background: 'linear-gradient(to right, var(--gradient-logo-start), var(--gradient-logo-end))' }}
            >
              {userAvatarUrl ? (
                <img src={userAvatarUrl} alt="프로필" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-white" />
              )}
            </div>
            <h3 className="text-[var(--text-primary)] font-bold text-lg">{userNickname}</h3>
            <p className="text-[var(--text-secondary)]">{session?.user?.email || '이메일 정보 없음'}</p>
          </div>
          <div className="space-y-2">
            <Link
              to="/account-settings"
              onClick={() => {
                setShowProfile(false);
                setShowMobileMenu(false);
              }}
              className="w-full p-3 text-left hover:bg-[var(--card-background-hover)] rounded-lg transition-colors text-[var(--text-primary)] block"
            >
              계정 설정
            </Link>
            <button className="w-full p-3 text-left hover:bg-[var(--card-background-hover)] rounded-lg transition-colors text-[var(--text-primary)]">
              투자 성향 설정
            </button>
            <button
              onClick={handleLogout}
              className="w-full p-3 text-left hover:bg-[var(--card-background-hover)] rounded-lg transition-colors text-[var(--text-accent-red)] flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              로그아웃
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Header;