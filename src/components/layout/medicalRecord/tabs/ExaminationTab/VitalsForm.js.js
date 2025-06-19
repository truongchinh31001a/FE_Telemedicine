'use client';

import {
    Card, Form, InputNumber, Input, Button, message,
} from 'antd';
import { useEffect } from 'react';

const { TextArea } = Input;

export default function VitalsForm({ recordId, measuredBy = 2, hasVitals = false, initialVitals = {}, onSuccess, onCancel }) {
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue(initialVitals);
    }, [initialVitals]);

    const handleSubmit = async (values) => {
        const token = document.cookie.match(/token=([^;]+)/)?.[1];
        if (!token || !recordId) return;

        try {
            const url = hasVitals
                ? `http://192.168.1.199:3000/medical-records/patientvitals/${recordId}`
                : 'http://192.168.1.199:3000/medical-records/patient/vital';

            const method = hasVitals ? 'PUT' : 'POST';

            await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    RecordID: recordId,
                    Pulse: values.pulse,
                    Temperature: values.temperature,
                    RespirationRate: values.respirationRate,
                    SpO2: values.spo2,
                    Weight: values.weight,
                    Height: values.height,
                    BMI: values.bmi,
                    BSA: values.bsa,
                    BloodPressureMin: values.bpMin,
                    BloodPressureMax: values.bpMax,
                    MeasuredBy: measuredBy,
                    Note: values.note
                })
            });

            message.success('Cập nhật sinh hiệu thành công!');
            onSuccess?.();
        } catch (err) {
            console.error('❌ Lỗi gửi sinh hiệu:', err);
            message.error('Gửi thất bại!');
        }
    };

    return (
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
            <Card title="❤️ Sinh hiệu">
                <div className="grid grid-cols-3 gap-4">
                    <Form.Item name="pulse" label="Mạch">
                        <InputNumber className="w-full" />
                    </Form.Item>
                    <Form.Item name="temperature" label="Nhiệt độ (°C)">
                        <InputNumber className="w-full" step={0.1} />
                    </Form.Item>
                    <Form.Item name="respirationRate" label="Nhịp thở">
                        <InputNumber className="w-full" />
                    </Form.Item>

                    <Form.Item name="spo2" label="SpO2 (%)">
                        <InputNumber className="w-full" />
                    </Form.Item>
                    <Form.Item name="weight" label="Cân nặng (kg)">
                        <InputNumber className="w-full" step={0.1} />
                    </Form.Item>
                    <Form.Item name="height" label="Chiều cao (cm)">
                        <InputNumber className="w-full" />
                    </Form.Item>

                    <Form.Item name="bmi" label="BMI">
                        <InputNumber className="w-full" step={0.1} />
                    </Form.Item>
                    <Form.Item name="bsa" label="BSA">
                        <InputNumber className="w-full" step={0.01} />
                    </Form.Item>
                    <Form.Item name="bpMin" label="Huyết áp tối thiểu">
                        <InputNumber className="w-full" />
                    </Form.Item>

                    <Form.Item name="bpMax" label="Huyết áp tối đa">
                        <InputNumber className="w-full" />
                    </Form.Item>
                    <Form.Item name="note" label="Ghi chú" className="col-span-3">
                        <TextArea rows={2} />
                    </Form.Item>
                </div>

                <div className="text-right space-x-2">
                    <Button onClick={onCancel}>Huỷ</Button>
                    <Button type="primary" htmlType="submit">
                        {hasVitals ? 'Cập nhật sinh hiệu' : 'Lưu sinh hiệu'}
                    </Button>
                </div>
            </Card>
        </Form>
    );
}
