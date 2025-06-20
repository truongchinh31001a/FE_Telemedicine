'use client';

import { useState, useEffect } from 'react';
import { Input, Button, Checkbox } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation'; // 🆕
import '@ant-design/v5-patch-for-react-19';
import Cookies from 'js-cookie';

export default function LoginForm({ onForgotClick }) {
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);  // Use this state to delay rendering until client-side
  const router = useRouter(); // 🆕

  // State để quản lý form data
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  // Hàm xử lý sự kiện thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username') setUsername(value);
    if (name === 'password') setPassword(value);
    if (name === 'remember') setRemember(e.target.checked);
  };

  // Hàm xử lý submit form
  const onSubmit = async (e) => {
    e.preventDefault(); // Ngừng hành vi mặc định của form

    try {
      // Gửi dữ liệu đăng nhập đến API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
        // credentials: 'include',
      });

      const result = await response.json();

      if (response.ok) {
        const { access_token } = result;  // Giả sử API trả về token với key là 'access_token'
        Cookies.set('token', access_token, {
          expires: 1,
          secure: location.protocol === 'https:',
          sameSite: 'Lax',
        });
        toast.success(t('login_success'));  // Chỉ thông báo thành công khi login thành công
        setTimeout(() => {
          router.push('/'); // Điều hướng sau khi login thành công
        }, 500);
      } else {
        toast.error(t('login_failed'));  // Nếu đăng nhập thất bại, chỉ báo lỗi
      }
    } catch (error) {
      toast.error(t('login_failed'));  // Nếu có lỗi khi gửi request
    }
  };

  // Đảm bảo rằng component chỉ được render khi mounted trên client
  useEffect(() => {
    setMounted(true);  // Khi component được mount trên client, cập nhật mounted thành true
  }, []);

  if (!mounted) return null;  // Không render trước khi component được mount

  return (
    <form onSubmit={onSubmit} className="w-[350px] h-[360px] animate-fade-in space-y-6 bg-white p-6 rounded-lg">
      <div className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">{t('username')}</label>
          <Input
            name="username"
            value={username}
            onChange={handleChange}
            placeholder={t('username')}
            className="py-2"
          />
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

        {/* <Button
          icon={<GoogleOutlined />}
          block
          onClick={() => {}}
          size="large"
        >
          {t('login_with_google')}
        </Button> */}
      </div>
    </form>
  );
}
