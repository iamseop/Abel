import React, { useState } from 'react';
import { Bell, Settings, User, LogOut, Calculator, Brain, Bookmark, TrendingUp, Menu, X } from 'lucide-react';
import Modal from './Modal';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
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
    { id: 'portfolio', label: '포트폴리오', icon: null },
    { id: 'watchlist', label: '관심종목', icon: Bookmark },
    { id: 'simulation', label: '모의투자', icon: TrendingUp },
    { id: 'calculator', label: '계산기', icon: Calculator },
    { id: 'personality', label: '투자성향', icon: Brain }
  ];

  const handleTabChange = (tabId: string) => {
    onTabChange(tabId);
    setShowMobileMenu(false);
  };

  return (
    <>
      <header className="glass-card backdrop-blur-xl border-b border-white/10 shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* 로고 */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => onTabChange('portfolio')}
                className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center hover:scale-105 transition-transform"
              >
                <span className="text-white font-bold text-sm">P</span>
              </button>
              
              {/* 데스크톱 네비게이션 */}
              <nav className="hidden lg:flex gap-1">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 text-sm ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {IconComponent && <IconComponent className="w-4 h-4" />}
                      {tab.label}
                    </button>
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
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors relative"
                >
                  <Bell className="w-5 h-5 text-gray-300" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>
                <button 
                  onClick={() => setShowSettings(true)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Settings className="w-5 h-5 text-gray-300" />
                </button>
                <button 
                  onClick={() => setShowProfile(true)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <User className="w-5 h-5 text-gray-300" />
                </button>
              </div>

              {/* 모바일 햄버거 메뉴 */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {showMobileMenu ? (
                  <X className="w-6 h-6 text-gray-300" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-300" />
                )}
              </button>
            </div>
          </div>

          {/* 모바일 메뉴 */}
          {showMobileMenu && (
            <>
              {/* 모바일 메뉴 배경 오버레이 */}
              <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
                onClick={() => setShowMobileMenu(false)}
              />
              
              {/* 모바일 메뉴 컨텐츠 */}
              <div className="lg:hidden mt-4 pb-4 border-t border-white/10 pt-4 relative z-40">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-3 text-left ${
                          activeTab === tab.id
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'text-gray-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {IconComponent && <IconComponent className="w-5 h-5" />}
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
                
                {/* 모바일 액션 버튼들 */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      onClick={() => {
                        setShowNotifications(true);
                        setShowMobileMenu(false);
                      }}
                      className="p-3 hover:bg-white/10 rounded-lg transition-colors flex flex-col items-center gap-1 relative"
                    >
                      <Bell className="w-5 h-5 text-gray-300" />
                      <span className="text-xs text-gray-300">알림</span>
                      <span className="absolute top-1 right-3 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                    <button 
                      onClick={() => {
                        setShowSettings(true);
                        setShowMobileMenu(false);
                      }}
                      className="p-3 hover:bg-white/10 rounded-lg transition-colors flex flex-col items-center gap-1"
                    >
                      <Settings className="w-5 h-5 text-gray-300" />
                      <span className="text-xs text-gray-300">설정</span>
                    </button>
                    <button 
                      onClick={() => {
                        setShowProfile(true);
                        setShowMobileMenu(false);
                      }}
                      className="p-3 hover:bg-white/10 rounded-lg transition-colors flex flex-col items-center gap-1"
                    >
                      <User className="w-5 h-5 text-gray-300" />
                      <span className="text-xs text-gray-300">프로필</span>
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
      >
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className="p-4 bg-gray-800 rounded-lg">
              <p className="text-white text-sm">{notification.message}</p>
              <p className="text-gray-400 text-xs mt-1">{notification.time}</p>
            </div>
          ))}
        </div>
      </Modal>

      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="설정"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
            <span className="text-white">다크 모드</span>
            <input type="checkbox" defaultChecked className="toggle" />
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
            <span className="text-white">알림 설정</span>
            <input type="checkbox" defaultChecked className="toggle" />
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
            <span className="text-white">자동 새로고침</span>
            <input type="checkbox" className="toggle" />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        title="프로필"
      >
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-white font-bold text-lg">김투자</h3>
            <p className="text-gray-400">investor@example.com</p>
          </div>
          <div className="space-y-2">
            <button className="w-full p-3 text-left hover:bg-white/5 rounded-lg transition-colors text-white">
              계정 설정
            </button>
            <button className="w-full p-3 text-left hover:bg-white/5 rounded-lg transition-colors text-white">
              투자 성향 설정
            </button>
            <button className="w-full p-3 text-left hover:bg-white/5 rounded-lg transition-colors text-red-400 flex items-center gap-2">
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