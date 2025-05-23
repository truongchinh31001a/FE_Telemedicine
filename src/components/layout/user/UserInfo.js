'use client';

import { Card, Avatar, Descriptions, Button } from 'antd';
import { UserOutlined, EditOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation'; // 👈 Thêm để kiểm tra route
import dayjs from 'dayjs';

export default function UserInfo({ user }) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const isHospitalUserPage = pathname?.includes('/users/hospital'); // 👈 Chỉ kiểm tra 1 lần

  if (!user) return null;

  const fullName = user.FullName ??
    `${user.lastName ?? ''} ${user.middleName ?? ''} ${user.firstName ?? ''}`.trim();

  const formatDate = (date) => {
    if (!date) return '-';
    const parsedDate = dayjs(date);
    return parsedDate.isValid() ? parsedDate.format('DD/MM/YYYY') : '-';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
      {/* Thông tin tài khoản */}
      <Card
        title={t('hospital_user.account_info')}
        extra={
          <Button type="text" icon={<EditOutlined />} onClick={() => console.log('Edit account')} />
        }
      >
        <div className="flex justify-center mb-4">
          <Avatar
            size={80}
            src={user.avatar ?? null}
            icon={<UserOutlined />}
          />
        </div>
        <Descriptions column={1} size="small">
          <Descriptions.Item label={t('hospital_user.username')}>
            {user.Username ?? user.username}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {user.Email ?? user.email}
          </Descriptions.Item>

          {isHospitalUserPage && (
            <Descriptions.Item label={t('hospital_user.managed_by')}>
              {user.ManagedBy ?? user.managedBy ?? '-'}
            </Descriptions.Item>
          )}

          <Descriptions.Item label={t('hospital_user.status')}>
            {user.Status ? t('hospital_user.active') : t('hospital_user.inactive')}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Thông tin người dùng */}
      <Card
        title={t('hospital_user.user_info')}
        extra={
          <Button type="text" icon={<EditOutlined />} onClick={() => console.log('Edit user')} />
        }
      >
        <Descriptions column={1} size="small">
          <Descriptions.Item label={t('hospital_user.full_name')}>
            {fullName}
          </Descriptions.Item>
          <Descriptions.Item label={t('hospital_user.date_of_birth')}>
            {formatDate(user.DateOfBirth ?? user.dateOfBirth)}
          </Descriptions.Item>
          <Descriptions.Item label={t('hospital_user.gender')}>
            {user.Gender ?? user.gender ?? '-'}
          </Descriptions.Item>
          <Descriptions.Item label={t('hospital_user.phone')}>
            {user.Phone ?? user.phone ?? '-'}
          </Descriptions.Item>
          <Descriptions.Item label={t('hospital_user.address')}>
            {user.Address ?? user.address ?? '-'}
          </Descriptions.Item>
          <Descriptions.Item label={t('hospital_user.cccd')}>
            {user.CCCD ?? user.cccd ?? '-'}
          </Descriptions.Item>
          <Descriptions.Item label={t('hospital_user.cccd_issued_date')}>
            {formatDate(user.CCCDIssueDate ?? user.cccdIssuedDate)}
          </Descriptions.Item>
          <Descriptions.Item label={t('hospital_user.cccd_issued_place')}>
            {user.CCCDIssuePlace ?? user.cccdIssuedPlace ?? '-'}
          </Descriptions.Item>
          <Descriptions.Item label={t('hospital_user.cccd_expired_date')}>
            {formatDate(user.CCCDExpiredDate)}
          </Descriptions.Item>
          {user.CCCDFront && (
            <Descriptions.Item label={t('hospital_user.cccd_front')}>
              <img src={user.CCCDFront} alt="CCCD Front" className="max-w-[200px]" />
            </Descriptions.Item>
          )}
          {user.CCCDBack && (
            <Descriptions.Item label={t('hospital_user.cccd_back')}>
              <img src={user.CCCDBack} alt="CCCD Back" className="max-w-[200px]" />
            </Descriptions.Item>
          )}
          <Descriptions.Item label={t('hospital_user.occupation')}>
            {user.job ?? user.Job ?? user.Position ?? user.occupation ?? '-'}
          </Descriptions.Item>
          <Descriptions.Item label={t('hospital_user.nationality')}>
            {user.Nationality ?? user.nationality ?? '-'}
          </Descriptions.Item>
          <Descriptions.Item label={t('hospital_user.ethnicity')}>
            {user.Ethnicity ?? user.ethnicity ?? '-'}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
