'use client';

import { useEffect, useState } from 'react';
import { DatePicker, Card, Table, Avatar } from 'antd';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { ArrowUpOutlined, ArrowDownOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const stats = [
    { title: 'Tổng số ca khám từ xa', value: 120, status: 'up' },
    { title: 'Thời gian chờ trung bình', value: '15 phút', status: 'down' },
    { title: 'Mức độ hài lòng trung bình', value: '4.2/5', status: 'up' },
    { title: 'Lịch khám hôm nay', value: 23, status: 'down' },
  ];

  const barData = [
    { hour: '07:00', daLieu: 2, hauPhau: 1, phuKhoa: 0, khac: 1 },
    { hour: '08:00', daLieu: 4, hauPhau: 2, phuKhoa: 1, khac: 0 },
    { hour: '09:00', daLieu: 3, hauPhau: 1, phuKhoa: 2, khac: 1 },
    { hour: '10:00', daLieu: 5, hauPhau: 2, phuKhoa: 2, khac: 2 },
    { hour: '11:00', daLieu: 2, hauPhau: 0, phuKhoa: 1, khac: 0 },
  ];

  const pieData = [
    { name: 'Đang diễn ra', value: 10, color: '#FF9E69' },
    { name: 'Đã hoàn thành', value: 15, color: '#2B4DED' },
    { name: 'Đã hủy', value: 5, color: '#FFD1A7' },
  ];

  const areaData = [
    { day: 'CN', count: 5 },
    { day: 'T2', count: 8 },
    { day: 'T3', count: 6 },
    { day: 'T4', count: 10 },
    { day: 'T5', count: 7 },
    { day: 'T6', count: 4 },
    { day: 'T7', count: 9 },
  ];

  const doctors = [
    { name: 'Nguyễn Văn A', dept: 'Da liễu', status: 'busy' },
    { name: 'Trần Thị B', dept: 'Phụ khoa', status: 'free' },
  ];

  const columns = [
    {
      title: 'Bác sĩ',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <div className="flex items-center gap-2">
          <Avatar icon={<UserOutlined />} />
          <span>{text}</span>
        </div>
      )
    },
    {
      title: 'Chuyên khoa',
      dataIndex: 'dept',
      key: 'dept'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span className={`px-2 py-1 rounded text-white text-xs ${status === 'busy' ? 'bg-[#79CFA6]' : 'bg-[#FF706F]'}`}>
          {status === 'busy' ? 'Đang khám' : 'Trống'}
        </span>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-lg text-gray-500">TeleMedicine System For Phan Chau Trinh Hospital</p>
        </div>
        <RangePicker className="w-fit" defaultValue={[dayjs(), dayjs()]} />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        {stats.map((s, i) => (
          <Card key={i} className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#D9F3EA]">
              <UserOutlined className="text-xl text-gray-700" />
            </div>
            <div className="flex-1">
              <div className="text-xl font-bold text-black">{s.value}</div>
              <div className="text-sm text-black">{s.title}</div>
              <div className={`inline-flex items-center px-2 py-1 mt-1 rounded-full text-xs ${s.status === 'up' ? 'bg-[#D9F3EA]' : 'bg-[#ffe7e7]'}`}>
                {s.status === 'up' ? <ArrowUpOutlined className="mr-1 text-[#a3a3a3]" /> : <ArrowDownOutlined className="mr-1 text-[#a3a3a3]" />}
                {s.status === 'up' ? 'Tăng' : 'Giảm'}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Bar chart */}
      <Card title="SỐ CA KHÁM THEO GIỜ">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="daLieu" fill="#3A4DE9" />
            <Bar dataKey="hauPhau" fill="#E93A43" />
            <Bar dataKey="phuKhoa" fill="#3AE93A" />
            <Bar dataKey="khac" fill="#FF925F" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Pie + Wave + Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie */}
        <Card title="TÌNH TRẠNG CA KHÁM HÔM NAY">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                outerRadius={90}
                dataKey="value"
              >
                {pieData.map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Area + Table */}
        <div className="space-y-6 col-span-1 lg:col-span-2">
          <Card title="Số ca khám theo ngày">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={areaData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#D9F3EA" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Danh sách bác sĩ">
            <Table
              pagination={false}
              dataSource={doctors}
              rowKey="name"
              columns={columns}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
