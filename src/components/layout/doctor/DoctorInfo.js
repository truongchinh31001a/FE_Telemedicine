'use client';

import { Card, Avatar, Button, Divider } from 'antd';
import { EditOutlined } from '@ant-design/icons';

export default function DoctorInfo({ doctor }) {
  if (!doctor) return null;

  return (
    <div className="flex gap-6 mt-5">
      {/* Left 80% */}
      <div className="w-[80%] space-y-4">
        <Card title="Thông tin bác sĩ">
          {/* Hàng 1: Avatar + BSCKII... */}
          <div className="flex gap-4 items-start">
            <Avatar size={80} src={doctor.avatar} />
            <div className="space-y-1">
              <p><strong>BSCKII:</strong> {doctor.FullName}</p>
              <p><strong>Mã quản lý:</strong> {doctor.Code ?? '-'}</p>
              <p><strong>Số BHXH:</strong> {doctor.SocialInsurance ?? '-'}</p>
            </div>
          </div>

          <Divider />

          {/* Hàng 2: Thông tin cá nhân */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <p><strong>Chuyên khoa chính:</strong> {doctor.Specialty ?? '-'}</p>
            <p><strong>Vai trò:</strong> {doctor.Role ?? '-'}</p>
            <p><strong>Chức danh:</strong> {doctor.Title ?? '-'}</p>

            <p><strong>SĐT:</strong> {doctor.Phone ?? '-'}</p>
            <p><strong>Email:</strong> {doctor.Email ?? '-'}</p>
            <p><strong>CCCD:</strong> {doctor.CCCD ?? '-'}</p>

            <p><strong>Ngày sinh:</strong> {doctor.DateOfBirth ?? '-'}</p>
            <p><strong>Giới tính:</strong> {doctor.Gender ?? '-'}</p>
            <p><strong>Dân tộc:</strong> {doctor.Ethnicity ?? '-'}</p>

            <p><strong>Quốc tịch:</strong> {doctor.Nationality ?? '-'}</p>
            <p className="md:col-span-2"><strong>Địa chỉ:</strong> {doctor.Address ?? '-'}</p>
          </div>

          <Divider />

          {/* Hàng 3: Các phần mở rộng */}
          <div className="space-y-4">
            <div>
              <strong>Giới thiệu:</strong>
              <p>{doctor.Introduction ?? '...'}</p>
            </div>
            <div>
              <strong>Khám và điều trị:</strong>
              <p>{doctor.TreatmentScope ?? '...'}</p>
            </div>
            <div>
              <strong>Quá trình công tác:</strong>
              <p>{doctor.WorkHistory ?? '...'}</p>
            </div>
            <div>
              <strong>Các công trình nghiên cứu và giải thưởng:</strong>
              <p>{doctor.Achievements ?? '...'}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Right 20% */}
      <div className="w-[20%] space-y-4">
        <Card
          title="Chuyên ngành"
          extra={<Button icon={<EditOutlined />} size="small" />}
        >
          <p>{doctor.Specialty ?? 'Chưa cập nhật'}</p>
        </Card>

        <Card title="Tệp đính kèm">
          {doctor.Attachments?.length > 0 ? (
            <ul className="list-disc list-inside">
              {doctor.Attachments.map((file, index) => (
                <li key={index}>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {file.name}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>Không có tệp đính kèm</p>
          )}
        </Card>
      </div>
    </div>
  );
}
