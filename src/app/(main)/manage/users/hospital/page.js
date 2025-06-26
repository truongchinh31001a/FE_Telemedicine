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
  const [isEditing, setIsEditing] = useState(false);

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
    avatar: d.Image ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${d.Image}` : null,
  });

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/proxy/staff', {
        method: 'GET',
        credentials: 'include',
      });

      const data = await res.json();
      setUsers(Array.isArray(data)
        ? data.map((s) => ({
          UserID: s.StaffID,
          FullName: s.FullName,
          avatar: s.Image ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${s.Image}` : null,
        }))
        : []);
    } catch (err) {
      console.error('❌ Error fetching staff list:', err);
    }
  }, []);

  const handleSelectUser = async (user) => {
    if (!user) return setSelectedUser(null);

    try {
      const res = await fetch(`/api/proxy/staff/${user.UserID}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!res.ok) return console.error('❌ Lỗi khi lấy chi tiết staff');

      const detail = await res.json();
      setSelectedUser(mapStaffDetail(detail));
      setIsEditing(false);
    } catch (err) {
      console.error('❌ Lỗi gọi API staff/:id', err);
    }
  };

  const handleAddOrUpdate = async (data) => {
    const isUpdate = Boolean(selectedUser?.UserID);
    const url = isUpdate
      ? `/api/proxy/staff/${selectedUser.UserID}`
      : `/api/proxy/staff`;
    const method = isUpdate ? 'PUT' : 'POST';

    try {
      const avatarFile = data.avatar?.[0]?.originFileObj;
      const frontFile = data.cccdFrontImage?.[0]?.originFileObj;
      const backFile = data.cccdBackImage?.[0]?.originFileObj;

      const dataWithoutFiles = { ...data };
      delete dataWithoutFiles.avatar;
      delete dataWithoutFiles.cccdFrontImage;
      delete dataWithoutFiles.cccdBackImage;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(dataWithoutFiles),
      });

      if (!res.ok) {
        console.error(`❌ Lỗi khi ${isUpdate ? 'cập nhật' : 'tạo'} staff`);
        return;
      }

      const result = await res.json();
      const staffId = isUpdate ? selectedUser.UserID : result.staffId;

      if (!isUpdate && staffId) {
        const uploadFile = async (file, uploadUrl) => {
          const formData = new FormData();
          formData.append('file', file);
          await fetch(uploadUrl, {
            method: 'POST',
            credentials: 'include',
            body: formData,
          });
        };

        if (avatarFile) {
          await uploadFile(avatarFile, `/api/proxy/upload/avatar/staff/${staffId}`);
        }

        if (frontFile) {
          await uploadFile(frontFile, `/api/proxy/upload/cccd/front/staff/${staffId}`);
        }

        if (backFile) {
          await uploadFile(backFile, `/api/proxy/upload/cccd/back/staff/${staffId}`);
        }
      }

      if (isUpdate) {
        const updatedList = users.map((u) =>
          u.UserID === selectedUser.UserID ? { ...u, ...data } : u
        );
        setUsers(updatedList);
      } else {
        const newUser = {
          ...result,
          avatar: avatarFile
            ? URL.createObjectURL(avatarFile)
            : `https://api.dicebear.com/7.x/initials/svg?seed=${data.fullName || 'A'}`,
        };
        setUsers([newUser, ...users]);
      }

      setSelectedUser(undefined);
      setIsEditing(false);
    } catch (err) {
      console.error('❌ Lỗi khi tạo/cập nhật staff hoặc upload ảnh:', err);
    }
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
          {selectedUser === null || isEditing ? (
            <UserForm
              onSubmit={handleAddOrUpdate}
              initialValues={selectedUser}
            />
          ) : selectedUser ? (
            <>
              <UserInfo user={selectedUser} onEdit={() => setIsEditing(true)} />
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
