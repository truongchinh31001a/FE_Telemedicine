'use client';

import {
    Card, Form, Input, InputNumber, DatePicker, Select, Button, message,
} from 'antd';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

const { TextArea } = Input;

export default function ExaminationForm({ onSuccess, patientId, measuredBy = 2, initialValues }) {
    const [form] = Form.useForm();
    const [drugOptions, setDrugOptions] = useState([]);
    const [showPrescription, setShowPrescription] = useState(false);

    const recordId = initialValues?.id;

    useEffect(() => {
        const fetchDrugs = async () => {
            try {
                const token = document.cookie.match(/token=([^;]+)/)?.[1];
                if (!token) return;
                const res = await fetch('http://192.168.1.199:3000/drug', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                const options = data.map((d) => ({ label: d.DrugName, value: d.DrugID }));
                setDrugOptions(options);
            } catch (err) {
                console.error('❌ Lỗi khi fetch danh sách thuốc:', err);
            }
        };

        fetchDrugs();
    }, []);

    useEffect(() => {
        if (initialValues && drugOptions.length > 0) {
            console.log('📦 initialValues.prescriptions:', initialValues.prescriptions);
            console.log('📦 drugOptions:', drugOptions);

            const prescriptionList = (initialValues.prescriptions || []).map((p) => {
                let drugId = p.DrugID;
                if (!drugId && p.DrugName) {
                    const found = drugOptions.find((d) => d.label === p.DrugName);
                    drugId = found?.value;
                }

                return {
                    drugId,
                    quantity: p.Quantity,
                    unit: p.PrescribedUnit ?? p.DrugUnit,
                    timeOfDay: p.TimeOfDay,
                    mealTiming: p.MealTiming,
                    note: p.Note,
                };
            });

            const preset = {
                date: initialValues.CreatedDate ? dayjs(initialValues.CreatedDate) : dayjs(),
                symptoms: initialValues.Symptoms,
                icdMain: initialValues.DiagnosisCode,
                note: initialValues.vitals?.find(v => v.label === 'Note')?.value,
                pulse: initialValues.vitals?.find(v => v.label === 'Pulse')?.value,
                temperature: initialValues.vitals?.find(v => v.label === 'Temperature')?.value,
                breathRate: initialValues.vitals?.find(v => v.label === 'Respiration Rate')?.value,
                spo2: initialValues.vitals?.find(v => v.label === 'SpO2')?.value,
                weight: initialValues.vitals?.find(v => v.label === 'Weight')?.value,
                height: initialValues.vitals?.find(v => v.label === 'Height')?.value,
                bmi: initialValues.vitals?.find(v => v.label === 'BMI')?.value,
                bsa: initialValues.vitals?.find(v => v.label === 'BSA')?.value,
                bpMax: initialValues.vitals?.find(v => v.label === 'Blood Pressure')?.value?.split('/')?.[0],
                bpMin: initialValues.vitals?.find(v => v.label === 'Blood Pressure')?.value?.split('/')?.[1]?.split(' ')[0],
                prescriptionList,
                solution: prescriptionList.length > 0 ? 'create' : 'none',
            };

            console.log('✅ preset values to set in form:', preset);
            form.setFieldsValue(preset);
            setShowPrescription(preset.solution === 'create');
        }
    }, [initialValues, drugOptions]);

    const handleSubmit = async (values) => {
        const token = document.cookie.match(/token=([^;]+)/)?.[1];
        if (!token) return;

        const {
            pulse, temperature, breathRate, spo2,
            weight, height, bmi, bsa, bpMin, bpMax,
            date, symptoms, icdMain, note, solution, prescriptionList = [],
        } = values;

        try {
            const method = recordId ? 'PUT' : 'POST';
            const url = recordId
                ? `http://192.168.1.199:3000/medical-records/${recordId}`
                : 'http://192.168.1.199:3000/medical-records/';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    PatientID: patientId,
                    CreatedDate: dayjs(date).format('YYYY-MM-DD'),
                    Symptoms: symptoms,
                    DiagnosisCode: icdMain,
                })
            });

            const data = await res.json();
            const newRecordId = recordId || data?.RecordID;
            if (!newRecordId) throw new Error('Không xác định được recordId');

            await fetch(`http://192.168.1.199:3000/medical-records/vitals/${newRecordId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    RecordID: newRecordId,
                    MeasuredBy: measuredBy,
                    Note: note || '',
                    Pulse: pulse,
                    Temperature: temperature,
                    RespirationRate: breathRate,
                    SpO2: spo2,
                    Weight: weight,
                    Height: height,
                    BMI: bmi,
                    BSA: bsa,
                    BloodPressureMin: bpMin,
                    BloodPressureMax: bpMax
                })
            });

            if (solution === 'create') {
                if (recordId) {
                    await fetch(`http://192.168.1.199:3000/prescriptions/${recordId}`, {
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                }

                if (prescriptionList.length > 0) {
                    await fetch(`http://192.168.1.199:3000/prescriptions/${newRecordId}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify(prescriptionList),
                    });
                }
            }

            message.success(recordId ? 'Cập nhật thành công!' : 'Tạo hồ sơ khám mới thành công!');
            onSuccess?.();
        } catch (err) {
            console.error('❌ Lỗi khi gửi form:', err);
            message.error('Gửi thất bại!');
        }
    };

    return (
        <Form
            layout="vertical"
            form={form}
            onFinish={handleSubmit}
            initialValues={{ date: dayjs(), solution: 'none' }}
            onValuesChange={(changed, all) => {
                if (changed.height || changed.weight) {
                    const { height, weight } = all;
                    if (height && weight) {
                        const heightInM = height / 100;
                        const bmi = +(weight / (heightInM ** 2)).toFixed(1);
                        const bsa = +(Math.sqrt((height * weight) / 3600)).toFixed(2);
                        form.setFieldsValue({ bmi, bsa });
                    }
                }
                if ('solution' in changed) {
                    setShowPrescription(changed.solution === 'create');
                }
            }}
        >
            <Card title="📋 Thông tin khám bệnh">
                <div className="grid grid-cols-2 gap-4">
                    <Form.Item label="Ngày khám" name="date"><DatePicker className="w-full" format="DD/MM/YYYY" /></Form.Item>
                    <Form.Item label="Triệu chứng lâm sàng" name="symptoms"><TextArea rows={2} /></Form.Item>
                </div>
            </Card>

            <Card title="❤️ Sinh hiệu">
                <div className="grid grid-cols-4 gap-4">
                    <Form.Item label="Mạch (lần/phút)" name="pulse"><InputNumber className="w-full" /></Form.Item>
                    <Form.Item label="Nhiệt độ (°C)" name="temperature"><InputNumber className="w-full" step={0.1} /></Form.Item>
                    <Form.Item label="Nhịp thở" name="breathRate"><InputNumber className="w-full" /></Form.Item>
                    <Form.Item label="SpO2 (%)" name="spo2"><InputNumber className="w-full" /></Form.Item>
                    <Form.Item label="Cân nặng (kg)" name="weight"><InputNumber className="w-full" step={0.1} /></Form.Item>
                    <Form.Item label="Chiều cao (cm)" name="height"><InputNumber className="w-full" /></Form.Item>
                    <Form.Item label="BMI" name="bmi"><InputNumber className="w-full" step={0.1} disabled /></Form.Item>
                    <Form.Item label="BSA" name="bsa"><InputNumber className="w-full" step={0.01} disabled /></Form.Item>
                    <Form.Item label="HA Tối thiểu" name="bpMin"><InputNumber className="w-full" /></Form.Item>
                    <Form.Item label="HA Tối đa" name="bpMax"><InputNumber className="w-full" /></Form.Item>
                </div>
            </Card>

            <Card title="🧠 Chẩn đoán">
                <Form.Item label="ICD chính" name="icdMain"><Input /></Form.Item>
                <Form.Item label="Ghi chú" name="note"><TextArea rows={2} /></Form.Item>
                <Form.Item label="Cách giải quyết" name="solution">
                    <Select options={[{ label: 'Không', value: 'none' }, { label: 'Tạo đơn thuốc', value: 'create' }]} />
                </Form.Item>

                {showPrescription && (
                    <Form.List name="prescriptionList">
                        {(fields, { add, remove }) => (
                            <div className="space-y-2">
                                {fields.map(({ key, name }) => (
                                    <div key={key} className="flex flex-wrap gap-4 items-end">
                                        <Form.Item name={[name, 'drugId']} label="Thuốc" className="mb-0">
                                            <Select
                                                options={drugOptions}
                                                showSearch
                                                optionFilterProp="label"
                                                placeholder="Chọn thuốc"
                                                style={{ width: 200 }}
                                            />
                                        </Form.Item>
                                        <Form.Item name={[name, 'unit']} label="Đơn vị" className="mb-0">
                                            <Input style={{ width: 100 }} />
                                        </Form.Item>
                                        <Form.Item name={[name, 'quantity']} label="Số lượng" className="mb-0">
                                            <InputNumber style={{ width: 100 }} />
                                        </Form.Item>
                                        <Form.Item name={[name, 'timeOfDay']} label="Thời điểm" className="mb-0">
                                            <Select
                                                options={[
                                                    { label: 'Sáng', value: 'Sáng' },
                                                    { label: 'Trưa', value: 'Trưa' },
                                                    { label: 'Chiều', value: 'Chiều' },
                                                    { label: 'Tối', value: 'Tối' },
                                                ]}
                                                style={{ width: 100 }}
                                            />
                                        </Form.Item>
                                        <Form.Item name={[name, 'mealTiming']} label="Trước/Sau ăn" className="mb-0">
                                            <Select
                                                options={[
                                                    { label: 'Trước ăn', value: 'Trước ăn' },
                                                    { label: 'Sau ăn', value: 'Sau ăn' },
                                                ]}
                                                style={{ width: 120 }}
                                            />
                                        </Form.Item>
                                        <Form.Item name={[name, 'note']} label="Ghi chú" className="mb-0">
                                            <Input style={{ width: 150 }} />
                                        </Form.Item>
                                        <Button danger onClick={() => remove(name)} type="text" className="mb-1">Xoá</Button>
                                    </div>
                                ))}
                                <Button type="dashed" onClick={() => add()} block>+ Thêm thuốc</Button>
                            </div>
                        )}
                    </Form.List>
                )}
            </Card>

            <div className="text-right">
                <Button type="primary" htmlType="submit">
                    {recordId ? 'Cập nhật' : 'Lưu thông tin khám bệnh'}
                </Button>
            </div>
        </Form>
    );
}
