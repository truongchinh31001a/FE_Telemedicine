'use client';

import { useState, useEffect } from 'react';
import { Input, Button, Checkbox } from 'antd';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import '@ant-design/v5-patch-for-react-19';

export default function LoginForm({ onForgotClick }) {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === 'username') setUsername(value);
    if (name === 'password') setPassword(value);
    if (name === 'remember') setRemember(checked);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (response.ok) {
        const { access_token } = result;

        // Gửi access_token về server để set cookie HttpOnly
        const setCookieResponse = await fetch(`/api/auth/set-token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: access_token }),
          credentials: 'include',
        });

        if (setCookieResponse.ok) {
          toast.success(t('login_success'));
          setTimeout(() => {
            router.push('/');
          }, 500);
        } else {

          if (setCookieResponse.status === 403) {
            toast.error(t('not_authorized')); 
          } else {
            toast.error(t('login_failed'));
          }
        }

      } else {
        toast.error(t('login_failed'));
      }
    } catch (error) {
      toast.error(t('login_failed'));
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <form onSubmit={onSubmit} className="w-[350px] h-[360px] animate-fade-in space-y-6 bg-white p-6 rounded-lg">
      <div className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">{t('username')}</label>
          <Input name="username" value={username} onChange={handleChange} placeholder={t('username')} className="py-2" />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">{t('password')}</label>
          <Input.Password
            name="password"
            value={password}
            onChange={handleChange}
            placeholder={t('password')}
            className="py-2"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Checkbox name="remember" checked={remember} onChange={handleChange}>
          {t('remember_me')}
        </Checkbox>

        <button type="button" onClick={onForgotClick} className="text-blue-500 hover:underline text-sm">
          {t('forgot_password')}
        </button>
      </div>

      <div className="space-y-3 pt-2">
        <Button type="primary" htmlType="submit" block size="large">
          {t('login')}
        </Button>
      </div>
    </form>
  );
}
