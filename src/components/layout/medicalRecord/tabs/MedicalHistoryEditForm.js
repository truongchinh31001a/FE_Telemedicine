'use client';

import { Modal, Form, Input, Button, message } from 'antd';
import { useEffect } from 'react';

export default function MedicalHistoryEditForm({
    open,
    onClose,
    patientId,
    type, // 'chronic' | 'family' | 'allergy'
    initialValues,
    onSuccess,
}) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (open && initialValues) {
            form.setFieldsValue({
                status: initialValues.status,
                note: initialValues.note,
            });
        }
    }, [open, initialValues]);

    const handleSubmit = async (values) => {
        try {
            const token = document.cookie.match(/token=([^;]+)/)?.[1];
            if (!token) return;

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/medical-records/history/${type}/${patientId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    Status: values.status,
                    Note: values.note,
                }),
            });

            if (!res.ok) throw new Error('Cập nhật thất bại');
            message.success('Cập nhật thành công!');
            onSuccess?.();
            onClose();
        } catch (err) {
            console.error('❌ Lỗi cập nhật:', err);
            message.error('Cập nhật thất bại');
        }
    };

    return (
        <Modal
            open={open}
            title="Chỉnh sửa bệnh sử"
            onCancel={onClose}
            footer={null}
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item label="Tình trạng" name="status" rules={[{ required: true, message: 'Nhập tình trạng' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Ghi chú" name="note">
                    <Input.TextArea rows={3} />
                </Form.Item>
                <div className="text-right">
                    <Button onClick={onClose} style={{ marginRight: 8 }}>Huỷ</Button>
                    <Button type="primary" htmlType="submit">Cập nhật</Button>
                </div>
            </Form>
        </Modal>
    );
}
