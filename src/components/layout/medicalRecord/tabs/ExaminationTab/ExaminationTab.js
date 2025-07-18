'use client';

import { Card, Table, Button, Spin } from 'antd';
import { useState, useEffect, useCallback } from 'react';
import { SolutionOutlined, EditOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import VitalsForm from './VitalsForm.js';
import PrescriptionForm from './PrescriptionForm.js';

const formatVitals = (vital) => {
  if (!vital) return [];
  return [
    { label: 'Pulse', value: vital.pulse },
    { label: 'Temperature', value: vital.temperature },
    { label: 'Respiration Rate', value: vital.respiration_rate },
    { label: 'SpO2', value: vital.spo2 },
    { label: 'Weight', value: vital.weight },
    { label: 'Height', value: vital.height },
    { label: 'BMI', value: vital.bmi },
    { label: 'BSA', value: vital.bsa },
    {
      label: 'Blood Pressure',
      value: `${vital.blood_pressure_max}/${vital.blood_pressure_min} mmHg`,
    },
    { label: 'Note', value: vital.note },
  ];
};

export default function ExaminationTab({ patientId }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [editingVitals, setEditingVitals] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState(false);

  const fetchExams = useCallback(async () => {
    if (!patientId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/proxy/medical-records/record/${patientId}`, {
        credentials: 'include',
      });
      const data = await res.json();
      setExams(
        data.map((item) => ({
          key: item.recordId,
          id: item.recordId,
          date: item.createdDate?.split('T')[0],
          method: 'Online',
          doctor: item.doctorName || 'Chưa rõ',
        }))
      );
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
      const [recordListRes, vitalsRes, presRes, labRes, imagingRes] = await Promise.all([
        fetch(`/api/proxy/medical-records/patient/${patientId}`, { credentials: 'include' }),
        fetch(`/api/proxy/medical-records/patient/vitals/${exam.id}`, { credentials: 'include' }),
        fetch(`/api/proxy/medical-records/patient/prescriptions/${exam.id}`, { credentials: 'include' }),
        fetch(`/api/proxy/medical-records/patient/lab-tests/${exam.id}`, { credentials: 'include' }),
        fetch(`/api/proxy/medical-records/patient/imaging-tests/${exam.id}`, { credentials: 'include' }),
      ]);

      const [recordList, vitalsData, prescriptionData, labTestsData, imagingTestsData] = await Promise.all([
        recordListRes.json(),
        vitalsRes.json(),
        presRes.json(),
        labRes.json(),
        imagingRes.json(),
      ]);

      const recordDetail = recordList.find((r) => r.RecordID === exam.id);

      const vitals = formatVitals(vitalsData?.[0]);
      const prescriptions = prescriptionData.map((p, index) => ({
        index: index + 1,
        DetailID: p.detail_id,
        DrugName: p.drug_name,
        Concentration: p.concentration,
        Quantity: p.quantity,
        PrescribedUnit: p.prescribed_unit,
        TimeOfDay: p.time_of_day,
        MealTiming: p.meal_timing,
      }));

      const labTests = labTestsData.map((item, index) => ({
        key: `lab-${item.lab_test_id}`,
        index: index + 1,
        name: item.test_type,
        code: `LAB-${item.lab_test_id}`,
        note: item.result,
        attachment: item.file_path ? (
          <a href={item.file_path} target="_blank" rel="noopener noreferrer">File</a>
        ) : null,
      }));

      const imagingTests = imagingTestsData.map((item, index) => ({
        key: `img-${item.imaging_test_id}`,
        index: index + 1,
        name: item.test_type,
        code: `IMG-${item.imaging_test_id}`,
        note: item.result,
        attachment: item.file_path ? (
          <a href={item.file_path} target="_blank" rel="noopener noreferrer">File</a>
        ) : null,
      }));

      setSelectedExam({
        ...exam,
        symptoms: recordDetail?.Symptoms ?? 'Không có ghi chú',
        diagnosisCode: recordDetail?.DiagnosisCode,
        vitals,
        rawVitals: vitalsData?.[0] ?? null,
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
    <div className="w-full">
      <div className="flex flex-col lg:flex-row gap-4">

        {!collapsed && (
          <div className="w-full lg:w-1/3 space-y-4">
            <Card title={t('examination.history_title')} extra={<Button type="text" onClick={() => setCollapsed(true)}>{t('examination.collapse') || 'Thu gọn'}</Button>}>
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

        <div className="flex-1 space-y-4">
          {collapsed && <Button onClick={() => setCollapsed(false)}>{t('examination.expand') || 'Mở lại'}</Button>}

          {selectedExam ? (
            <>
              <Card title={t('examination.detail_title')}>
                <p>{t('examination.date')}: {selectedExam.date}</p>
                <p>{t('examination.room')}: {selectedExam.room}</p>
                <p>{t('examination.method')}: {selectedExam.method}</p>
                <p>{t('examination.doctor_name')}: {selectedExam.doctor}</p>
                <p>{t('examination.symptoms')}: {selectedExam.symptoms}</p>
              </Card>

              <Card title={t('examination.vitals')} extra={<Button icon={<EditOutlined />} onClick={() => setEditingVitals(true)}>Sửa</Button>}>
                {editingVitals ? (
                  <VitalsForm
                    recordId={selectedExam.id}
                    hasVitals={!!selectedExam.rawVitals}
                    initialVitals={selectedExam.rawVitals ? {
                      pulse: selectedExam.rawVitals.Pulse,
                      temperature: selectedExam.rawVitals.Temperature,
                      respirationRate: selectedExam.rawVitals.RespirationRate,
                      spo2: selectedExam.rawVitals.SpO2,
                      weight: selectedExam.rawVitals.Weight,
                      height: selectedExam.rawVitals.Height,
                      bmi: selectedExam.rawVitals.BMI,
                      bsa: selectedExam.rawVitals.BSA,
                      bpMin: selectedExam.rawVitals.BloodPressureMin,
                      bpMax: selectedExam.rawVitals.BloodPressureMax,
                      note: selectedExam.rawVitals.Note,
                    } : {}}
                    onSuccess={() => {
                      setEditingVitals(false);
                      fetchExams();
                    }}
                    onCancel={() => setEditingVitals(false)}
                  />
                ) : (
                  <ul className="pl-4 list-disc">
                    {selectedExam.vitals?.map((v, idx) => (
                      <li key={idx}>{v.label}: {v.value}</li>
                    ))}
                  </ul>
                )}
              </Card>

              <Card title={t('examination.prescription_title')} extra={<Button icon={<EditOutlined />} onClick={() => setEditingPrescription(true)}>Sửa</Button>}>
                {editingPrescription ? (
                  <PrescriptionForm
                    recordId={selectedExam.id}
                    appointmentId={selectedExam.appointmentId}
                    doctorId={selectedExam.doctorId}
                    initialPrescription={{ StartDate: selectedExam?.CreatedDate, Days: 3 }}
                    initialList={selectedExam.prescriptions || []}
                    onSuccess={() => {
                      setEditingPrescription(false);
                      fetchExams();
                    }}
                    onCancel={() => setEditingPrescription(false)}
                  />
                ) : (
                  <Table
                    dataSource={selectedExam.prescriptions || []}
                    columns={prescriptionColumns}
                    pagination={false}
                    rowKey="DetailID"
                    scroll={{ x: 800 }}
                    size="small"
                  />
                )}
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
