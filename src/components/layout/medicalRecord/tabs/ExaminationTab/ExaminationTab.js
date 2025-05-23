'use client';

import { Card, Table, Button, Spin } from 'antd';
import { useState, useEffect, useCallback } from 'react';
import { SolutionOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import ExaminationForm from './ExaminationForm';

const getAuthTokenFromCookie = () => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/token=([^;]+)/);
  return match?.[1] ?? null;
};

const formatVitals = (vital) => {
  if (!vital) return [];
  return [
    { label: 'Pulse', value: vital.Pulse },
    { label: 'Temperature', value: vital.Temperature },
    { label: 'Respiration Rate', value: vital.RespirationRate },
    { label: 'SpO2', value: vital.SpO2 },
    { label: 'Weight', value: vital.Weight },
    { label: 'Height', value: vital.Height },
    { label: 'BMI', value: vital.BMI },
    { label: 'BSA', value: vital.BSA },
    {
      label: 'Blood Pressure',
      value: `${vital.BloodPressureMax}/${vital.BloodPressureMin} mmHg`,
    },
    { label: 'Note', value: vital.Note },
  ];
};

export default function ExaminationTab({ patientId }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fetchExams = useCallback(async () => {
    if (!patientId) return;
    setLoading(true);
    try {
      const token = getAuthTokenFromCookie();
      const res = await fetch(`http://192.168.1.199:3000/medical-records/records/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const mapped = data.map((item) => ({
        key: item.RecordID,
        id: item.RecordID,
        date: item.CreatedDate?.split('T')[0],
        method: 'Online',
        doctor: item.DoctorName,
      }));
      setExams(mapped);
      setSelectedExam(null);
    } catch (err) {
      console.error('❌ Lỗi khi fetch examination records:', err);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  const handleSelectExam = async (exam) => {
    setCollapsed(true);
    setLoading(true);
    try {
      const token = getAuthTokenFromCookie();

      const [recordDetailRes, vitalsRes, presRes, labRes, imagingRes] = await Promise.all([
        fetch(`http://192.168.1.199:3000/medical-records/patient/${exam.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`http://192.168.1.199:3000/medical-records/vitals/${exam.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`http://192.168.1.199:3000/prescriptions/${exam.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`http://192.168.1.199:3000/lab-tests/${exam.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`http://192.168.1.199:3000/imaging-tests/${exam.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const [recordDetail, vitalsData, prescriptionData, labTestsData, imagingTestsData] = await Promise.all([
        recordDetailRes.json(),
        vitalsRes.json(),
        presRes.json(),
        labRes.json(),
        imagingRes.json(),
      ]);

      const vitals = formatVitals(vitalsData?.[0]);
      const prescriptions = (prescriptionData || []).map((p, index) => ({ ...p, index: index + 1 }));
      const labTests = (labTestsData || []).map((item, index) => ({
        index: index + 1,
        name: item.TestType,
        code: `LAB-${item.LabTestID}`,
        note: item.Result,
        attachment: item.FilePath ? (
          <a href={item.FilePath} target="_blank" rel="noopener noreferrer">File</a>
        ) : null,
      }));
      const imagingTests = (imagingTestsData || []).map((item, index) => ({
        index: index + 1,
        name: item.TestType,
        code: `IMG-${item.ImagingTestID}`,
        note: item.Result,
        attachment: item.FilePath ? (
          <a href={item.FilePath} target="_blank" rel="noopener noreferrer">File</a>
        ) : null,
      }));

      setSelectedExam({
        ...exam,
        ...recordDetail,
        vitals,
        prescriptions,
        labTests,
        imagingTests,
      });
    } catch (err) {
      console.error('❌ Lỗi khi fetch chi tiết:', err);
    } finally {
      setLoading(false);
    }
  };

  const prescriptionColumns = [
    { title: 'STT', dataIndex: 'index', width: 50 },
    { title: 'Tên thuốc', dataIndex: 'DrugName' },
    { title: 'Hàm lượng', dataIndex: 'Concentration' },
    { title: 'Số lượng', dataIndex: 'Quantity', width: 80 },
    { title: 'Đơn vị', dataIndex: 'PrescribedUnit', width: 80 },
    { title: 'Thời điểm uống', dataIndex: 'TimeOfDay', width: 120 },
    { title: 'Trước/Sau ăn', dataIndex: 'MealTiming', width: 150 },
  ];

  const labColumns = [
    { title: 'STT', dataIndex: 'index', width: 60 },
    { title: 'Mã dịch vụ', dataIndex: 'code', width: 120 },
    { title: 'Tên dịch vụ', dataIndex: 'name', width: 180 },
    { title: 'Kết quả', dataIndex: 'note', width: 300 },
    { title: 'Tệp đính kèm', dataIndex: 'attachment', width: 120 },
  ];

  if (loading) return <Spin />;

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex gap-4 min-w-[1280px]">
        {!collapsed && (
          <div className="flex-shrink-0 w-[calc(100%-810px)] max-w-[400px] space-y-4">
            <Card
              title={t('examination.history_title')}
              extra={
                <div className="flex gap-2">
                  <Button type="text" onClick={() => setCollapsed(true)}>
                    {t('examination.collapse') || 'Thu gọn'}
                  </Button>
                </div>
              }
            >
              <Table
                dataSource={exams}
                columns={[
                  { title: t('examination.date'), dataIndex: 'date' },
                  { title: t('examination.method'), dataIndex: 'method' },
                  { title: t('examination.doctor'), dataIndex: 'doctor' },
                  {
                    title: t('examination.detail'),
                    render: (_, record) => (
                      <Button type="link" onClick={() => handleSelectExam(record)}>
                        <SolutionOutlined />
                      </Button>
                    ),
                  },
                ]}
                pagination={false}
                rowKey="id"
                size="small"
              />
            </Card>
          </div>
        )}

        <div className="w-[810px] min-w-0 space-y-4 overflow-x-auto">
          {collapsed && (
            <div className="mb-2">
              <Button onClick={() => setCollapsed(false)}>
                {t('examination.expand') || 'Mở lại'}
              </Button>
            </div>
          )}

          {isAdding ? (
            <Card title={isEditing ? 'Sửa thông tin khám bệnh' : 'Thêm thông tin khám bệnh'}>
              <ExaminationForm
                patientId={patientId}
                recordId={isEditing ? selectedExam?.id : undefined}
                initialValues={isEditing ? selectedExam : undefined}
                onSuccess={() => {
                  setIsAdding(false);
                  setIsEditing(false);
                  setSelectedExam(null);
                  fetchExams();
                }}
              />
              <div className="text-right mt-4">
                <Button onClick={() => {
                  setIsAdding(false);
                  setIsEditing(false);
                }}>Huỷ</Button>
              </div>
            </Card>
          ) : selectedExam ? (
            <>
              <Card
                title={t('examination.detail_title')}
                extra={<Button icon={<EditOutlined />} onClick={() => {
                  setIsAdding(true);
                  setIsEditing(true);
                }}>Sửa</Button>}
              >
                <p>{t('examination.date')}: {selectedExam.date}</p>
                <p>{t('examination.room')}: {selectedExam.room}</p>
                <p>{t('examination.method')}: {selectedExam.method}</p>
                <p>{t('examination.doctor_name')}: {selectedExam.doctor}</p>
                <p>{t('examination.symptoms')}: {selectedExam.symptoms}</p>
                <p>{t('examination.vitals')}:</p>
                <ul className="pl-4 list-disc">
                  {selectedExam.vitals?.map((v, idx) => (
                    <li key={idx}>{v.label}: {v.value}</li>
                  ))}
                </ul>
              </Card>

              <Card title={t('examination.prescription_title')}>
                <Table
                  dataSource={selectedExam.prescriptions || []}
                  columns={prescriptionColumns}
                  pagination={false}
                  rowKey="DetailID"
                  scroll={{ x: 800 }}
                  size="small"
                />
              </Card>

              <Card title={t('examination.lab_test_title')}>
                <Table
                  dataSource={selectedExam.labTests || []}
                  columns={labColumns}
                  pagination={false}
                  rowKey="code"
                  size="small"
                  scroll={{ x: 700 }}
                />
              </Card>

              <Card title={t('examination.imaging_title')}>
                <Table
                  dataSource={selectedExam.imagingTests || []}
                  columns={labColumns}
                  pagination={false}
                  rowKey="code"
                  size="small"
                  scroll={{ x: 700 }}
                />
              </Card>
            </>
          ) : (
            <Card>
              <p className="text-gray-500 italic">{t('examination.select_hint')}</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}