'use client';

import { useEffect, useState } from 'react';
import { Menu } from 'antd';
import {
  PieChartOutlined,
  UserOutlined,
  CalendarOutlined,
  TeamOutlined,
  FileOutlined,
  SettingOutlined,
  AppstoreOutlined,
  FolderOpenOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import logo from '@/assets/logo.jpg';
import { useTranslation } from 'react-i18next';

const Sidebar = ({ collapsed = false }) => {
  const pathname = usePathname();
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (i18n.isInitialized) setMounted(true);
    else i18n.on('initialized', () => setMounted(true));
  }, [i18n]);

  if (!mounted) return null;

  const menuItems = [
    {
      key: '/reports',
      icon: <PieChartOutlined />,
      label: <Link href="/">{t('sidebar.reports')}</Link>,
    },
    {
      key: 'manage',
      icon: <AppstoreOutlined />,
      label: t('sidebar.manage'),
      children: [
        {
          key: 'users',
          icon: <UserOutlined />,
          label: t('sidebar.users'),
          children: [
            {
              key: '/manage/users/hospital',
              label: <Link href="/manage/users/hospital">{t('sidebar.hospital')}</Link>,
            },
            {
              key: '/manage/users/patient',
              label: <Link href="/manage/users/patient">{t('sidebar.patient')}</Link>,
            },
          ],
        },
        {
          key: 'schedule',
          icon: <CalendarOutlined />,
          label: t('sidebar.schedule'),
          children: [
            {
              key: '/manage/schedule/work',
              label: <Link href="/manage/schedule/work">{t('sidebar.schedule_work')}</Link>,
            },
            {
              key: '/manage/schedule/appointment',
              label: <Link href="/manage/schedule/appointment">{t('sidebar.schedule_appointment')}</Link>,
            },
          ],
        },
        {
          key: '/manage/doctor',
          icon: <TeamOutlined />,
          label: <Link href="/manage/doctor">{t('sidebar.doctor')}</Link>,
        },
        {
          key: 'patient',
          icon: <TeamOutlined />,
          label: t('sidebar.patient'),
          children: [
            {
              key: '/manage/patient/records',
              label: <Link href="/manage/patient/records">{t('sidebar.patient_records')}</Link>,
            },
          ],
        },
        {
          key: '/manage/department',
          icon: <HomeOutlined />,
          label: <Link href="/manage/department">{t('sidebar.department')}</Link>,
        },
        // {
        //   key: '/manage/storage',
        //   icon: <FolderOpenOutlined />,
        //   label: <Link href="/manage/storage">{t('sidebar.storage')}</Link>,
        // },
        // {
        //   key: 'inventory',
        //   icon: <FileOutlined />,
        //   label: t('sidebar.inventory'),
        //   children: [
        //     {
        //       key: '/manage/inventory/receipt',
        //       label: <Link href="/manage/inventory/receipt">{t('sidebar.inventory_receipt')}</Link>,
        //     },
        //     {
        //       key: '/manage/inventory/issue',
        //       label: <Link href="/manage/inventory/issue">{t('sidebar.inventory_issue')}</Link>,
        //     },
        //     {
        //       key: '/manage/inventory/audit',
        //       label: <Link href="/manage/inventory/audit">{t('sidebar.inventory_audit')}</Link>,
        //     },
        //   ],
        // },
        // {
        //   key: 'category',
        //   icon: <FolderOpenOutlined />,
        //   label: t('sidebar.category'),
        //   children: [
        //     {
        //       key: '/manage/category/supplier',
        //       label: <Link href="/manage/category/supplier">{t('sidebar.supplier')}</Link>,
        //     },
        //     {
        //       key: '/manage/category/manufacturer',
        //       label: <Link href="/manage/category/manufacturer">{t('sidebar.manufacturer')}</Link>,
        //     },
        //     {
        //       key: '/manage/category/medicine',
        //       label: <Link href="/manage/category/medicine">{t('sidebar.medicine')}</Link>,
        //     },
        //     {
        //       key: '/manage/category/disease',
        //       label: <Link href="/manage/category/disease">{t('sidebar.disease')}</Link>,
        //     },
        //     {
        //       key: '/manage/category/test',
        //       label: <Link href="/manage/category/test">{t('sidebar.test')}</Link>,
        //     },
        //     {
        //       key: '/manage/category/imaging',
        //       label: <Link href="/manage/category/imaging">{t('sidebar.imaging')}</Link>,
        //     },
        //   ],
        // },
      ],
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: <Link href="/settings">{t('sidebar.settings')}</Link>,
    },
    {
      key: '/support',
      icon: <FileOutlined />,
      label: <Link href="/support">{t('sidebar.support')}</Link>,
    },
  ];

  return (
    <div className={`h-screen bg-[#303444] text-white flex flex-col ${collapsed ? 'w-16' : 'w-64'} transition-all duration-300`}>
      {/* Logo */}
      <div className="p-4 flex items-center justify-center">
        <Image src={logo} alt="Logo" width={collapsed ? 30 : 40} height={collapsed ? 30 : 40} className="rounded-full" />
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto">
        <Menu
          mode="inline"
          theme="dark"
          inlineCollapsed={collapsed}
          selectedKeys={[pathname]}
          defaultOpenKeys={['manage']}
          style={{ backgroundColor: '#303444', borderRight: 0 }}
          items={menuItems}
        />
      </div>
    </div>
  );
};

export default Sidebar;
