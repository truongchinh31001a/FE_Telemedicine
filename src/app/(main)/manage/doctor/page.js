'use client';

import DoctorInfo from '@/components/layout/doctor/DoctorInfo';
import DoctorPanel from '@/components/layout/doctor/DoctorPanel';
import { useEffect, useState } from 'react';

export default function DoctorPage() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState();

  // Fake data mẫu
  useEffect(() => {
    setDoctors([
      {
        UserID: 1,
        FullName: 'TS.BS Nguyễn Văn A',
        avatar: null,
        Specialty: 'Tim mạch',
        Code: 'BS001',
        SocialInsurance: '123456789',
        Role: 'Bác sĩ điều trị',
        Title: 'Trưởng khoa',
        Phone: '0912345678',
        Email: 'vana@example.com',
        CCCD: '012345678901',
        DateOfBirth: '1975-06-20',
        Gender: 'Nam',
        Ethnicity: 'Kinh',
        Nationality: 'Việt Nam',
        Address: '123 Lê Lợi, Q1, TP.HCM',
        Introduction: 'Bác sĩ chuyên về tim mạch với hơn 20 năm kinh nghiệm...',
        TreatmentScope: 'Khám và điều trị các bệnh lý tim mạch mạn tính.',
        WorkHistory: 'Bệnh viện Chợ Rẫy (2000-2010), BV Đại học Y Dược (2010-nay)',
        Achievements: 'Giải thưởng bác sĩ tiêu biểu 2020',
        Attachments: [
          { name: 'Sơ yếu lý lịch.pdf', url: '/files/profile.pdf' },
          { name: 'Bằng chuyên khoa II.jpg', url: '/files/bangck2.jpg' }
        ]
      },
    ]);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Danh sách bác sĩ</h1>
      <div className="flex gap-6">
        <DoctorPanel
          doctors={doctors}
          onSelectDoctor={setSelectedDoctor}
          onReload={() => {}} // bạn có thể thay bằng API thật
        />

        <div className="flex-1">
          {selectedDoctor ? (
            <DoctorInfo doctor={selectedDoctor} />
          ) : (
            <p className="text-gray-400 italic mt-4">Chọn bác sĩ để xem chi tiết</p>
          )}
        </div>
      </div>
    </div>
  );
}
