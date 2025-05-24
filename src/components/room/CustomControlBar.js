'use client';

import { useEffect, useState } from 'react';
import { ControlBar } from '@livekit/components-react';
import { Dropdown } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import PatientMedicalRecordModal from './PatientMedicalRecordModal';
import PrescriptionModal from '../layout/prescription/PrescriptionModal';

export default function CustomControlBar({ patientId, recordId, appointmentId }) {
  const [openProfile, setOpenProfile] = useState(false);
  const [openPrescription, setOpenPrescription] = useState(false); // 👈 thêm state mới

  useEffect(() => {
    
  }, [patientId, recordId, appointmentId]);

  const items = [
    {
      key: 'profile',
      label: 'Xem hồ sơ',
      onClick: () => {
        if (!patientId) return alert('Không có patientId!');
        setOpenProfile(true);
      },
    },
    {
      key: 'prescription',
      label: 'Tạo đơn thuốc',
      onClick: () => {
        if (!recordId) return alert('Không có recordId!');
        setOpenPrescription(true); // 👈 mở modal
      },
    },
    // {
    //   key: 'newProfile',
    //   label: 'Tạo hồ sơ mới',
    //   onClick: () => alert('📝 Tạo hồ sơ mới'),
    // },
  ];

  return (
    <>
      <div
        className="w-full flex items-center justify-between px-4 py-2 bg-black text-white"
        style={{ height: 'var(--lk-control-bar-height)' }}
      >
        <ControlBar className="flex-1" />

        <Dropdown menu={{ items }} trigger={['click']}>
          <button
            className="ml-4 p-2 bg-white text-black rounded-full shadow hover:bg-gray-100"
            title="Tùy chọn khác"
          >
            <MoreOutlined />
          </button>
        </Dropdown>
      </div>

      <PatientMedicalRecordModal
        open={openProfile}
        onClose={() => setOpenProfile(false)}
        patientId={patientId}
        recordId={recordId}
      />

      <PrescriptionModal
        open={openPrescription}
        onClose={() => setOpenPrescription(false)}
        recordId={recordId}
        appointmentId={appointmentId}
        onSuccess={() => {
          setOpenPrescription(false);     // Đóng modal đơn thuốc
          setTimeout(() => {
            setOpenProfile(true);         // Mở lại modal hồ sơ bệnh án
          }, 300); // Delay để tránh xung đột hiển thị
        }}
      />
    </>
  );
}
