'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

import UserPanel from '@/components/layout/user/UserPanel';
import UserInfo from '@/components/layout/user/UserInfo';
import PatientForm from '@/components/layout/user/PatientForm';

export default function PatientUserPage() {
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState();

  // Map danh sách bệnh nhân
  const mapPatient = (p) => ({
    UserID: p.PatientID,
    FullName: p.FullName,
    avatar: p.Image ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${p.Image}` : null,
  });

  // Map chi tiết bệnh nhân
  const mapPatientDetail = (d) => ({
    UserID: d.UserInfoID,
    FullName: d.FullName,
    DateOfBirth: d.DateOfBirth,
    Phone: d.Phone,
    Address: d.Address,
    Gender: d.Gender,
    Job: d.PatientJob,
    CCCD: d.CCCD,
    CCCDIssueDate: d.CCCDIssueDate,
    CCCDIssuePlace: d.CCCDIssuePlace ?? d.Hometown,
    CCCDExpiredDate: d.CCCDExpiredDate,
    Ethnicity: d.Ethnicity,
    Nationality: d.Nationality,
    avatar: d.Image ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${d.Image}` : null,
    CCCDFront: d.CCCDFront ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${d.CCCDFront}` : null,
    CCCDBack: d.CCCDBack ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${d.CCCDBack}` : null,
  });

  const fetchUsers = useCallback(async () => {

    try {
      const res = await fetch('/api/proxy/patients', {
        method: 'GET',
        credentials: 'include',
      });

      const data = await res.json();
      setUsers(Array.isArray(data) ? data.map(mapPatient) : []);
    } catch (error) {
      console.error('❌ Error fetching patients:', error);
    }
  }, []);

  const handleSelectUser = async (user) => {
    if (!user) return setSelectedUser(null);

    try {
      const res = await fetch(`/api/proxy/patients/${user.UserID}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!res.ok) return console.error('❌ Lỗi khi lấy chi tiết bệnh nhân');

      const detail = await res.json();
      setSelectedUser(mapPatientDetail(detail));
    } catch (err) {
      console.error('❌ Lỗi gọi API patient/:id', err);
    }
  };

  const handleAddOrUpdate = async (data) => {
    const isUpdate = Boolean(selectedUser?.UserID);
    const formatDate = (date) => (date ? dayjs(date).format('YYYY-MM-DD') : '');

    const payload = {
      FullName: data.FullName,
      DateOfBirth: formatDate(data.DateOfBirth),
      Gender: data.Gender,
      Phone: data.Phone,
      Address: data.Address,
      Hometown: data.Hometown,
      CCCD: data.CCCD,
      CCCDIssueDate: formatDate(data.CCCDIssueDate),
      CCCDIssuePlace: data.CCCDIssuePlace,
      CCCDExpiredDate: formatDate(data.CCCDExpiredDate),
      Nationality: data.Nationality,
      Ethnicity: data.Ethnicity,
      Job: data.Job,
    };

    try {
      const res = await fetch(
        `/api/proxy/patients${isUpdate ? `/${selectedUser.UserID}` : ''}`,
        {
          method: isUpdate ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(payload),
        }
      );

      const resText = await res.text();
      if (!res.ok) {
        console.error('❌ Response status:', res.status);
        console.error('❌ Response body:', resText);
        throw new Error('Lỗi khi gửi dữ liệu bệnh nhân');
      }

      await fetchUsers();
      setSelectedUser(undefined);
    } catch (err) {
      console.error('❌ Lỗi khi thêm/cập nhật bệnh nhân:', err);
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
      <h1 className="text-2xl font-bold mb-4">{t('patient_user.title')}</h1>
      <div className="flex gap-6">
        <UserPanel users={users} onSelectUser={handleSelectUser} onReload={fetchUsers} allowAdd={false} />
        <div className="flex-1 space-y-6">
          {selectedUser === null ? (
            <PatientForm onSubmit={handleAddOrUpdate} />
          ) : selectedUser ? (
            <UserInfo user={selectedUser} />
          ) : (
            <p className="text-gray-400 italic mt-4">{t('patient_user.select_prompt')}</p>
          )}
        </div>
      </div>
    </div>
  );
}
