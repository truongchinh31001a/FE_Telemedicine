'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import UserPanel from '@/components/layout/user/UserPanel';
import UserInfo from '@/components/layout/user/UserInfo';
import UserForm from '@/components/layout/user/UserForm';
import PermissionTable from '@/components/layout/user/PermissionTable';

export default function HospitalUserPage() {
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState();

  // Lấy token từ cookie
  const getAuthTokenFromCookie = () => {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(/token=([^;]+)/);
    return match?.[1] ?? null;
  };

  // Map thông tin chi tiết staff từ API
  const mapStaffDetail = (d) => ({
    UserID: d.StaffID,
    Username: d.Username,
    Email: d.Email,
    FullName: d.FullName,
    DateOfBirth: d.DateOfBirth,
    Phone: d.Phone,
    Address: d.Address,
    Gender: d.Gender,
    CCCD: d.CCCD,
    CCCDIssuePlace: d.CCCDIssuePlace,
    CCCDIssueDate: d.CCCDIssueDate,
    CCCDExpiredDate: d.CCCDExpiredDate,
    Position: d.Position,
    RoleName: d.RoleName,
    ManagedBy: d.DepartmentName,
    Ethnicity: d.Ethnicity,
    Nationality: d.Nationality,
    avatar: d.Image ? `http://192.168.1.199:3000/uploads/${d.Image}` : null,
  });

  const fetchUsers = useCallback(async () => {
    const token = getAuthTokenFromCookie();
    if (!token) return console.warn('⚠️ Không tìm thấy token');

    try {
      const res = await fetch('http://192.168.1.199:3000/staff', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setUsers(Array.isArray(data)
        ? data.map((s) => ({
            UserID: s.StaffID,
            FullName: s.FullName,
            avatar: s.Image ? `http://192.168.1.199:3000/uploads/${s.Image}` : null,
          }))
        : []);
    } catch (err) {
      console.error('❌ Error fetching staff list:', err);
    }
  }, []);

  const handleSelectUser = async (user) => {
    if (!user) return setSelectedUser(null);

    const token = getAuthTokenFromCookie();
    if (!token) return console.warn('⚠️ Không tìm thấy token');

    try {
      const res = await fetch(`http://192.168.1.199:3000/staff/${user.UserID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return console.error('❌ Lỗi khi lấy chi tiết staff');

      const detail = await res.json();
      setSelectedUser(mapStaffDetail(detail));
    } catch (err) {
      console.error('❌ Lỗi gọi API staff/:id', err);
    }
  };

  const handleAddOrUpdate = (data) => {
    const isUpdate = Boolean(selectedUser?.UserID);

    if (isUpdate) {
      const updatedList = users.map((u) =>
        u.UserID === selectedUser.UserID ? { ...u, ...data } : u
      );
      setUsers(updatedList);
    } else {
      const newUser = {
        ...data,
        UserID: users.length + 1,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${data.firstName || 'A'}`,
        joinedAt: new Date().toISOString(),
      };
      setUsers([newUser, ...users]);
    }

    setSelectedUser(undefined);
  };

  useEffect(() => {
    if (i18n.isInitialized) setMounted(true);
    else i18n.on('initialized', () => setMounted(true));
  }, [i18n]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (!mounted) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{t('hospital_user.title')}</h1>
      <div className="flex gap-6">
        <UserPanel users={users} onSelectUser={handleSelectUser} onReload={fetchUsers} />
        <div className="flex-1 space-y-6">
          {selectedUser === null ? (
            <UserForm onSubmit={handleAddOrUpdate} />
          ) : selectedUser ? (
            <>
              <UserInfo user={selectedUser} />
              <PermissionTable />
            </>
          ) : (
            <p className="text-gray-400 italic mt-4">
              {t('hospital_user.select_user_hint')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
