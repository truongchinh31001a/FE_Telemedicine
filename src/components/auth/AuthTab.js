'use client';

import { useState } from 'react';
import LoginForm from './LoginForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import LanguageSwitcher from '../common/LanguageSwitcher';
import Image from 'next/image';
import logo from '@/assets/logo.jpg';
import illustration from '@/assets/medicine.jpg';

export default function AuthTab() {
  const [tab, setTab] = useState('login');

  return (
    <div className="w-[400px] rounded-xl shadow-lg bg-white overflow-hidden relative">
      {/* Header */}
      <div className="bg-indigo-100 p-6">
        <div className="flex items-center justify-between">
          {/* Text bên trái */}
          <div>
            <h2 className="text-xl font-semibold text-indigo-700">
              Chào mừng trở lại!
            </h2>
            <p className="text-sm text-indigo-600">Đăng nhập để tiếp tục</p>
          </div>

          {/* Ảnh bên phải */}
          <div>
            <Image src={illustration} alt="Welcome" width={100} height={70} />
          </div>
        </div>
      </div>

      {/* Logo nổi giữa */}
      <div className="w-full flex -mt-9 z-10 relative">
        <div className="bg-white p-2 rounded-full shadow-md ml-5">
          <Image
            src={logo}
            alt="Logo"
            width={55}
            height={55}
            className="rounded-full"
          />
        </div>
      </div>

      {/* Form + Language */}
      <div className="px-6 pt-4 pb-6 flex flex-col items-center">
        <div className="w-full">
          {tab === 'login' ? (
            <LoginForm onForgotClick={() => setTab('forgot')} />
          ) : (
            <ForgotPasswordForm onBack={() => setTab('login')} />
          )}
        </div>

        <div className="mt-6">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
}
