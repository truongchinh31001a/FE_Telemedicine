'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '@ant-design/v5-patch-for-react-19';
import { Spin, Card } from 'antd';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (i18n.isInitialized) {
      setMounted(true);
    } else {
      i18n.on('initialized', () => setMounted(true));
    }
  }, [i18n]);

  if (!mounted) {
    return (
      <Spin tip="Đang tải ngôn ngữ..." size="large">
        <div className="h-screen flex items-center justify-center" />
      </Spin>
    );
  }

  const performanceData = [
    { name: 'T2', value: 3 },
    { name: 'T3', value: 5 },
    { name: 'T4', value: 2 },
    { name: 'T5', value: 6 },
    { name: 'T6', value: 4 },
    { name: 'T7', value: 1 },
  ];

  const progressData = [
    { name: t('dashboard.tasks_done'), value: 18 },
    { name: 'Đang làm', value: 5 },
    { name: 'Chưa bắt đầu', value: 3 },
  ];

  const COLORS = ['#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="p-6">
      <div className='s-20 mb-5'>
        <strong> {t('dashboard.home')}</strong>
      </div>
      <div className="flex gap-6">
        {/* 30% LEFT */}
        <div className="w-1/3 flex flex-col gap-4">
          <Card title={t('dashboard.welcome')}>
            <p>{t('dashboard.welcome_msg')}</p>
          </Card>

          <Card title={t('dashboard.performance')}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={performanceData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#1890ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card title={t('dashboard.recent_activity')}>
            <ul className="text-sm list-disc ml-4">
              <li>Xem báo cáo tuần trước</li>
              <li>Giao việc mới cho phòng A</li>
              <li>Hoàn thành checklist 5 mục</li>
            </ul>
          </Card>
        </div>

        {/* 70% RIGHT */}
        <div className="w-2/3 flex flex-col gap-4">
          {/* div4: 4 box nhỏ */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card title={t('dashboard.tasks_total')}>
              <p>24</p>
            </Card>
            <Card title={t('dashboard.tasks_done')}>
              <p>18</p>
            </Card>
            <Card title={t('dashboard.value_total')}>
              <p>120 triệu</p>
            </Card>
            <Card title={t('dashboard.value_avg')}>
              <p>6 triệu</p>
            </Card>
          </div>

          <Card title={t('dashboard.progress')}>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={progressData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {progressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card title={t('dashboard.status_overview')}>
            <p>To-do, In Progress, Done...</p>
          </Card>

          <Card title={t('dashboard.level_overview')}>
            <p>Cao - Trung - Thấp</p>
          </Card>

          <Card title={t('dashboard.delayed_tasks')}>
            <ul className="text-sm list-disc ml-4">
              <li>Công việc A - 2 ngày trễ</li>
              <li>Công việc B - 1 ngày trễ</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
