'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import MedicalRecordPanel from '@/components/layout/medicalRecord/MedicalRecordPanel';
import MedicalRecordTab from '@/components/layout/medicalRecord/MedicalRecordTab';

export default function PatientMedicalRecordPage() {
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    if (i18n.isInitialized) setMounted(true);
    else i18n.on('initialized', () => setMounted(true));
  }, [i18n]);

  const getAuthTokenFromCookie = () => {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(/token=([^;]+)/);
    return match?.[1] ?? null;
  };

  const fetchRecords = useCallback(async () => {
    const token = getAuthTokenFromCookie();
    if (!token) return console.warn('⚠️ Không tìm thấy token');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/patients`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!Array.isArray(data)) return;

      const mapped = data.map((p) => ({
        id: p.PatientID,
        name: p.FullName,
        avatar: p.Image ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${p.Image}` : null,
      }));

      setRecords(mapped);
    } catch (err) {
      console.error('❌ Lỗi khi fetch danh sách hồ sơ:', err);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  if (!mounted) return null;

  return (
    <div className="overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">{t('medical_record.title')}</h1>
      <div className="flex gap-6">
        {/* Bên trái: danh sách hồ sơ */}
        <MedicalRecordPanel
          records={records}
          onSelectRecord={(r) => {
            const record = records.find((item) => item.id === r?.id);
            setSelectedRecord(record ?? null);
          }}
          selectedId={selectedRecord?.id}
        />

        {/* Bên phải: tab thông tin */}
        <div className="flex-1">
          {selectedRecord ? (
            <MedicalRecordTab record={selectedRecord} />
          ) : (
            <p className="text-gray-400 italic mt-4">
              {t('medical_record.select_record_hint')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
