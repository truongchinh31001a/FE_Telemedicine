'use client';

import { Card, Table, Spin, Button } from 'antd';
import {
  FileTextOutlined,
  TeamOutlined,
  AlertOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import MedicalHistoryEditForm from './MedicalHistoryEditForm';

const getAuthTokenFromCookie = () => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/token=([^;]+)/);
  return match?.[1] ?? null;
};

export default function MedicalHistoryTab({ patientId }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    chronicDiseases: [],
    familyDiseases: [],
    allergies: [],
  });
  const [openEdit, setOpenEdit] = useState(false);
  const [editType, setEditType] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const fetchData = async () => {
    if (!patientId) return;
    setLoading(true);
    try {
      const token = getAuthTokenFromCookie();
      if (!token) return;
      const res = await fetch(`http://192.168.1.199:3000/medical-records/history/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const raw = await res.json();

      const chronicDiseases = (raw.chronicHistory || []).map((d, i) => ({
        index: i + 1,
        disease: d.DiseaseName,
        status: d.Status,
        doctor: `BS ${d.DoctorName}`,
        date: d.DetectedDate?.split('T')[0],
        note: d.Note,
        type: 'chronic',
      }));

      const familyDiseases = (raw.familyHistory || []).map((d, i) => ({
        index: i + 1,
        disease: d.DiseaseName,
        relation: d.Relation,
        status: d.Status,
        doctor: `BS ${d.DoctorName}`,
        date: d.DetectedDate?.split('T')[0],
        note: d.Note,
        type: 'family',
      }));

      const allergies = (raw.allergyHistory || []).map((d, i) => ({
        index: i + 1,
        substance: d.Substance,
        status: d.Status,
        doctor: `BS ${d.DoctorName}`,
        date: d.DetectedDate?.split('T')[0],
        note: d.Note,
        type: 'allergy',
      }));

      setData({ chronicDiseases, familyDiseases, allergies });
    } catch (err) {
      console.error('❌ Lỗi khi fetch medical history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [patientId]);

  const addEditCol = (cols, type) => ([
    ...cols,
    {
      title: '',
      render: (_, record) => (
        <Button
          icon={<EditOutlined />}
          onClick={() => {
            setSelectedRow(record);
            setEditType(type);
            setOpenEdit(true);
          }}
        />
      ),
      width: 60,
    },
  ]);

  if (loading) return <Spin />;

  return (
    <div className="space-y-6">
      <Card title={<span><FileTextOutlined className="mr-2" />{t('medical_history.chronic_title')}</span>}>
        <Table
          dataSource={data.chronicDiseases}
          columns={addEditCol([
            { title: t('medical_history.index'), dataIndex: 'index', key: 'index', width: 50 },
            { title: t('medical_history.disease'), dataIndex: 'disease', key: 'disease' },
            { title: t('medical_history.status'), dataIndex: 'status', key: 'status' },
            { title: t('medical_history.doctor'), dataIndex: 'doctor', key: 'doctor' },
            { title: t('medical_history.date'), dataIndex: 'date', key: 'date' },
            { title: t('medical_history.note'), dataIndex: 'note', key: 'note' },
          ], 'chronic')}
          pagination={false}
          rowKey="index"
        />
      </Card>

      <Card title={<span><TeamOutlined className="mr-2" />{t('medical_history.family_title')}</span>}>
        <Table
          dataSource={data.familyDiseases}
          columns={addEditCol([
            { title: t('medical_history.index'), dataIndex: 'index', key: 'index', width: 50 },
            { title: t('medical_history.disease'), dataIndex: 'disease', key: 'disease' },
            { title: t('medical_history.relation'), dataIndex: 'relation', key: 'relation' },
            { title: t('medical_history.status'), dataIndex: 'status', key: 'status' },
            { title: t('medical_history.doctor'), dataIndex: 'doctor', key: 'doctor' },
            { title: t('medical_history.date'), dataIndex: 'date', key: 'date' },
            { title: t('medical_history.note'), dataIndex: 'note', key: 'note' },
          ], 'family')}
          pagination={false}
          rowKey="index"
        />
      </Card>

      <Card title={<span><AlertOutlined className="mr-2" />{t('medical_history.allergy_title')}</span>}>
        <Table
          dataSource={data.allergies}
          columns={addEditCol([
            { title: t('medical_history.index'), dataIndex: 'index', key: 'index', width: 50 },
            { title: t('medical_history.substance'), dataIndex: 'substance', key: 'substance' },
            { title: t('medical_history.status'), dataIndex: 'status', key: 'status' },
            { title: t('medical_history.doctor'), dataIndex: 'doctor', key: 'doctor' },
            { title: t('medical_history.date'), dataIndex: 'date', key: 'date' },
            { title: t('medical_history.note'), dataIndex: 'note', key: 'note' },
          ], 'allergy')}
          pagination={false}
          rowKey="index"
        />
      </Card>

      <MedicalHistoryEditForm
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        patientId={patientId}
        type={editType}
        initialValues={selectedRow}
        onSuccess={() => {
          setOpenEdit(false);
          fetchData();
        }}
      />
    </div>
  );
}