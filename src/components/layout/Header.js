// Header.js
import { BellOutlined, MessageOutlined, UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Dropdown, Avatar, Space, Badge, Button } from 'antd';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import Cookies from 'js-cookie';

export default function Header({ collapsed, onToggle }) {
  const router = useRouter(); // Sử dụng useRouter để điều hướng
  const { fullName, loading } = useAuth(); // Sử dụng hook để lấy thông tin người dùng

  // Hàm xử lý đăng xuất
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }); // Gọi API đăng xuất
      router.push('/auth'); // hoặc `/vi/auth` tùy locale
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="w-full h-[60px] bg-white px-4 py-2 flex items-center justify-between border-b border-gray-200 shadow-sm">
      {/* Nút thu gọn sidebar (bên trái) */}
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={onToggle}
        className="text-lg"
      />

      {/* Khu vực bên phải */}
      <Space size="large">
        <LanguageSwitcher />

        <Badge dot>
          <MessageOutlined className="text-xl cursor-pointer" />
        </Badge>

        <Badge count={3}>
          <BellOutlined className="text-xl cursor-pointer" />
        </Badge>

        <Dropdown
          menu={{
            items: [
              { key: 'profile', label: 'Hồ sơ' },
              { key: 'logout', label: 'Đăng xuất', onClick: handleLogout }, // Đăng xuất và xóa cookie
            ],
          }}
        >
          <div className="flex items-center gap-2 cursor-pointer">
            <Avatar size="small" icon={<UserOutlined />} />
            <span className="text-sm font-medium">{loading ? 'Loading...' : fullName}</span>  {/* Hiển thị tên người dùng */}
          </div>
        </Dropdown>
      </Space>
    </div>
  );
}
