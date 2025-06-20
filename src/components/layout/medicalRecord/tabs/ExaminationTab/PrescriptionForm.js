'use client';

import {
    Card, Form, Input, InputNumber, DatePicker, Select, Button, message,
} from 'antd';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

export default function PrescriptionForm({ recordId, appointmentId, initialPrescription, initialList = [], onSuccess, onCancel }) {
    const [form] = Form.useForm();
    const [drugOptions, setDrugOptions] = useState([]);

    useEffect(() => {
        const fetchDrugs = async () => {
            const token = document.cookie.match(/token=([^;]+)/)?.[1];
            if (!token) return;
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/drug`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setDrugOptions(data.map(d => ({ label: d.DrugName, value: d.DrugID })));
        };
        fetchDrugs();
    }, []);

    useEffect(() => {
        if (initialPrescription || initialList.length) {
            form.setFieldsValue({
                startDate: dayjs(initialPrescription?.StartDate),
                days: initialPrescription?.Days,
                prescriptionList: initialList.map(p => ({
                    detailId: p.DetailID,
                    drugId: {
                        label: p.DrugName,
                        value: p.DrugID
                    },
                    unit: p.Unit,
                    quantity: p.Quantity,
                    timeOfDay: p.TimeOfDay,
                    mealTiming: p.MealTiming,
                    note: p.Note,
                }))
            });
        }
    }, [initialPrescription, initialList]);

    const handleDelete = async (detailId) => {
        const token = document.cookie.match(/token=([^;]+)/)?.[1];
        if (!token || !detailId) return;
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/prescriptions/detail/${detailId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            message.success('Xoá thuốc thành công!');
            onSuccess?.();
        } catch (err) {
            console.error('❌ Lỗi xoá thuốc:', err);
            message.error('Xoá thuốc thất bại!');
        }
    };

    const handleSubmit = async (values) => {
        const token = document.cookie.match(/token=([^;]+)/)?.[1];
        if (!token) return;

        try {
            let currentRecordId = recordId;

            if (!currentRecordId && appointmentId) {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/prescriptions/create-treatment/${appointmentId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        startDate: values.startDate.format(),
                        days: values.days
                    })
                });
                const data = await res.json();
                currentRecordId = data?.RecordID;
            }

            if (currentRecordId) {
                await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/prescriptions/${currentRecordId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        StartDate: values.startDate.format(),
                        Days: values.days
                    })
                });
            }

            const updateList = values.prescriptionList
                .filter(p => p.detailId)
                .map(p => ({ ...p, drugId: p.drugId?.value }));

            const createList = values.prescriptionList
                .filter(p => !p.detailId)
                .map(p => ({ ...p, drugId: p.drugId?.value }));

            if (updateList.length > 0) {
                await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/prescriptions/details`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(updateList.map(p => ({
                        DetailID: p.detailId,
                        DrugID: p.drugId,
                        Unit: p.unit,
                        Quantity: p.quantity,
                        TimeOfDay: p.timeOfDay,
                        MealTiming: p.mealTiming,
                        Note: p.note
                    })))
                });
            }

            if (createList.length > 0 && currentRecordId) {
                await fetch(`http://192.168.1.199:3000/prescriptions/${currentRecordId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(createList.map(p => ({
                        drugId: p.drugId,
                        unit: p.unit,
                        quantity: p.quantity,
                        timeOfDay: p.timeOfDay,
                        mealTiming: p.mealTiming,
                        note: p.note
                    })))
                });
            }

            message.success('Cập nhật đơn thuốc thành công!');
            onSuccess?.();
        } catch (err) {
            console.error('❌ Lỗi cập nhật đơn thuốc:', err);
            message.error('Cập nhật thất bại!');
        }
    };

    return (
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
            <Card title="📦 Thông tin đơn thuốc">
                <div className="grid grid-cols-2 gap-4">
                    <Form.Item name="startDate" label="Ngày bắt đầu">
                        <DatePicker className="w-full" />
                    </Form.Item>
                    <Form.Item name="days" label="Số ngày dùng thuốc">
                        <InputNumber min={1} className="w-full" />
                    </Form.Item>
                </div>
            </Card>

            <Card title="💊 Danh sách thuốc">
                <Form.List name="prescriptionList">
                    {(fields, { add, remove }) => (
                        <div className="space-y-2">
                            {fields.map(({ key, name }) => (
                                <div key={key} className="flex flex-wrap gap-4 items-end">
                                    <Form.Item name={[name, 'drugId']} label="Thuốc" className="mb-0">
                                        <Select
                                            labelInValue
                                            options={drugOptions}
                                            showSearch
                                            optionFilterProp="label"
                                            style={{ width: 200 }}
                                            placeholder="Chọn thuốc"
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
                                    <Button
                                        danger
                                        onClick={async () => {
                                            const fieldValue = form.getFieldValue(['prescriptionList', name]);
                                            if (fieldValue?.detailId) {
                                                await handleDelete(fieldValue.detailId);
                                            }
                                            remove(name);
                                        }}
                                        type="text"
                                        className="mb-1"
                                    >
                                        Xoá
                                    </Button>
                                </div>
                            ))}
                            <Button type="dashed" onClick={() => add()} block>+ Thêm thuốc</Button>
                        </div>
                    )}
                </Form.List>

                <div className="text-right mt-4 space-x-2">
                    <Button onClick={onCancel}>Huỷ</Button>
                    <Button type="primary" htmlType="submit">Lưu đơn thuốc</Button>
                </div>
            </Card>
        </Form>
    );
}
