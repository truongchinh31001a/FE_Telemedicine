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
                const res = await fetch('/api/proxy/drug', {
                    credentials: 'include',
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
            const prescriptionList = (initialValues.prescriptions || []).map((p) => {
                let drugId = p.DrugID;
                if (!drugId && p.DrugName) {
                    const found = drugOptions.find((d) => d.label === p.DrugName);
                    drugId = found?.value;
                }
                return {
                    detailId: p.DetailID,
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
                temperature: initialValues.vitals?.find(v => v.label === 'Temperature')?.value,
                spo2: initialValues.vitals?.find(v => v.label === 'SpO2')?.value,
                prescriptionList,
                solution: prescriptionList.length > 0 ? 'create' : 'none',
            };
            form.setFieldsValue(preset);
            setShowPrescription(preset.solution === 'create');
        }
    }, [initialValues, drugOptions]);

    const handleSubmit = async (values) => {
        const {
            temperature, spo2, note,
            date, symptoms, icdMain, solution, prescriptionList = [],
        } = values;

        try {
            const method = recordId ? 'PUT' : 'POST';
            const url = recordId
                ? `/api/proxy/medical-records/${recordId}`
                : `/api/proxy/medical-records/`;

            const res = await fetch(url, {
                method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    PatientID: patientId,
                    CreatedDate: date ? date.toISOString() : undefined,
                    Symptoms: symptoms,
                    DiagnosisCode: icdMain,
                }),
            });

            const data = await res.json();
            const newRecordId = recordId || data?.RecordID;
            if (!newRecordId) throw new Error('Không xác định được recordId');

            await fetch(`/api/proxy/medical-records/patient/vitals/${newRecordId}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    vitals: [
                        { label: 'Temperature', value: temperature },
                        { label: 'SpO2', value: spo2 },
                        { label: 'Note', value: note }
                    ]
                }),
            });

            if (solution === 'create') {
                const newPres = prescriptionList.filter(p => !p.detailId).map(p => ({
                    drugId: p.drugId,
                    unit: p.unit,
                    quantity: p.quantity,
                    timeOfDay: p.timeOfDay
                }));
                const updatePres = prescriptionList.filter(p => p.detailId).map(p => ({
                    DetailID: p.detailId,
                    DrugID: p.drugId,
                    Unit: p.unit,
                    Quantity: p.quantity,
                    TimeOfDay: p.timeOfDay
                }));

                if (newPres.length > 0) {
                    await fetch(`/api/proxy/prescriptions/${newRecordId}`, {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(newPres),
                    });
                }

                if (updatePres.length > 0) {
                    await fetch(`/api/proxy/prescriptions/details`, {
                        method: 'PUT',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(updatePres),
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
            onValuesChange={(changed) => {
                if ('solution' in changed) {
                    setShowPrescription(changed.solution === 'create');
                }
            }}
        >
            <Card title="📋 Thông tin khám bệnh">
                <div className="grid grid-cols-2 gap-4">
                    <Form.Item label="Ngày khám" name="date">
                        <DatePicker className="w-full" format="DD/MM/YYYY" />
                    </Form.Item>
                    <Form.Item label="Triệu chứng lâm sàng" name="symptoms">
                        <TextArea rows={2} />
                    </Form.Item>
                </div>
            </Card>

            <Card title="❤️ Sinh hiệu">
                <div className="grid grid-cols-3 gap-4">
                    <Form.Item label="Nhiệt độ (°C)" name="temperature">
                        <InputNumber className="w-full" step={0.1} />
                    </Form.Item>
                    <Form.Item label="SpO2 (%)" name="spo2">
                        <InputNumber className="w-full" />
                    </Form.Item>
                    <Form.Item label="Ghi chú" name="note">
                        <TextArea rows={2} />
                    </Form.Item>
                </div>
            </Card>

            <Card title="🧠 Chẩn đoán">
                <Form.Item label="ICD chính" name="icdMain">
                    <Input />
                </Form.Item>
                <Form.Item label="Cách giải quyết" name="solution">
                    <Select
                        options={[
                            { label: 'Không', value: 'none' },
                            { label: 'Tạo đơn thuốc', value: 'create' },
                        ]}
                    />
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
                                        <Button danger onClick={() => remove(name)} type="text" className="mb-1">
                                            Xoá
                                        </Button>
                                    </div>
                                ))}
                                <Button type="dashed" onClick={() => add()} block>
                                    + Thêm thuốc
                                </Button>
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
