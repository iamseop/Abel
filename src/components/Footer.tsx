import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-2">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <h3 className="text-white font-bold text-lg">Abel</h3>
          </div>
          
          <div className="space-y-2 mb-6">
            <p className="text-gray-400 text-sm">
              스마트한 투자 관리를 위한 올인원 플랫폼
            </p>
            <p className="text-gray-500 text-xs">
              투자에는 원금 손실의 위험이 있으며, 과거 수익률이 미래를 보장하지 않습니다.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mb-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              서비스 소개
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              이용약관
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              개인정보처리방침
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              고객센터
            </a>
          </div>

          <div className="border-t border-white/5 pt-6">
            <p className="text-gray-500 text-sm">
              © {currentYear} Portfolio Manager. All rights reserved.
            </p>
            <p className="text-gray-600 text-xs mt-2">
              Made with ❤️ for smart investors
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;