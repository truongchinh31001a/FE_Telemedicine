'use client';

import { useEffect, useState } from 'react';
import {
    Modal,
    Form,
    Select,
    Input,
    InputNumber,
    Button,
    Table,
    message,
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import '@ant-design/v5-patch-for-react-19';

const { TextArea } = Input;

export default function PrescriptionModal({ open, onClose, recordId, appointmentId }) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [drugOptions, setDrugOptions] = useState([]);

    useEffect(() => {
        const fetchDrugs = async () => {
            const token = document.cookie.match(/token=([^;]+)/)?.[1];
            if (!token) return;
            try {
                const res = await fetch('http://192.168.1.199:3000/drug', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                setDrugOptions(data.map((d) => ({ label: d.DrugName, value: d.DrugID })));
            } catch (err) {
                console.error('❌ Lỗi khi fetch danh sách thuốc:', err);
            }
        };
        if (open) fetchDrugs();
    }, [open]);

    const handleSubmit = async (values) => {
        if (!recordId) return message.error('Thiếu recordId');
        if (!appointmentId) return message.error('Thiếu appointmentId');
        try {
            const token = document.cookie.match(/token=([^;]+)/)?.[1];
            if (!token) return;

            setLoading(true);

            // Step 1: Tạo treatment
            await fetch(`http://192.168.1.199:3000/prescriptions/create-treatment/${appointmentId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    startDate: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
                    days: 3,
                }),
            });

            // Step 2: Gửi từng đơn thuốc
            for (const item of values.prescriptions || []) {
                await fetch(`http://192.168.1.199:3000/prescriptions/${recordId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(item),
                });
            }

            message.success('Tạo đơn thuốc thành công');
            form.resetFields();
            onClose();
            onSuccess?.();
        } catch (err) {
            console.error('❌ Lỗi khi tạo đơn thuốc:', err);
            message.error('Tạo đơn thuốc thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Tạo đơn thuốc"
            open={open}
            onCancel={onClose}
            footer={null}
            width={1000}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{ prescriptions: [] }}
            >
                <Form.List name="prescriptions">
                    {(fields, { add, remove }) => (
                        <>
                            <Table
                                dataSource={fields.map(field => ({ ...field, key: field.key }))}
                                pagination={false}
                                size="small"
                                columns={[
                                    {
                                        title: 'Thuốc',
                                        dataIndex: 'drugId',
                                        render: (_, field) => (
                                            <Form.Item
                                                name={[field.name, 'drugId']}
                                                rules={[{ required: true, message: 'Chọn thuốc' }]}
                                                noStyle
                                            >
                                                <Select
                                                    options={drugOptions}
                                                    placeholder="Chọn thuốc"
                                                    showSearch
                                                    style={{ width: 160 }}
                                                />
                                            </Form.Item>
                                        ),
                                    },
                                    {
                                        title: 'Số lượng',
                                        dataIndex: 'quantity',
                                        render: (_, field) => (
                                            <Form.Item
                                                name={[field.name, 'quantity']}
                                                rules={[{ required: true, message: 'Nhập số lượng' }]}
                                                noStyle
                                            >
                                                <InputNumber style={{ width: 100 }} />
                                            </Form.Item>
                                        ),
                                    },
                                    {
                                        title: 'Đơn vị',
                                        dataIndex: 'unit',
                                        render: (_, field) => (
                                            <Form.Item
                                                name={[field.name, 'unit']}
                                                rules={[{ required: true, message: 'Nhập đơn vị' }]}
                                                noStyle
                                            >
                                                <Input style={{ width: 100 }} />
                                            </Form.Item>
                                        ),
                                    },
                                    {
                                        title: 'Thời điểm',
                                        dataIndex: 'timeOfDay',
                                        render: (_, field) => (
                                            <Form.Item name={[field.name, 'timeOfDay']} noStyle>
                                                <Select
                                                    options={['Sáng', 'Trưa', 'Chiều', 'Tối'].map((v) => ({ label: v, value: v }))}
                                                    style={{ width: 100 }}
                                                />
                                            </Form.Item>
                                        ),
                                    },
                                    {
                                        title: 'Trước/Sau ăn',
                                        dataIndex: 'mealTiming',
                                        render: (_, field) => (
                                            <Form.Item name={[field.name, 'mealTiming']} noStyle>
                                                <Select
                                                    options={[
                                                        { label: 'Trước ăn', value: 'Trước ăn' },
                                                        { label: 'Sau ăn', value: 'Sau ăn' },
                                                    ]}
                                                    style={{ width: 100 }}
                                                />
                                            </Form.Item>
                                        ),
                                    },
                                    {
                                        title: 'Ghi chú',
                                        dataIndex: 'note',
                                        render: (_, field) => (
                                            <Form.Item name={[field.name, 'note']} noStyle>
                                                <Input style={{ width: 150 }} />
                                            </Form.Item>
                                        ),
                                    },
                                    {
                                        title: '',
                                        render: (_, __, index) => (
                                            <Button
                                                danger
                                                type="text"
                                                icon={<DeleteOutlined />}
                                                onClick={() => remove(index)}
                                            />
                                        ),
                                    },
                                ]}
                            />
                            <div className="mt-4">
                                <Button
                                    icon={<PlusOutlined />}
                                    type="dashed"
                                    onClick={() => add()}
                                >
                                    Thêm thuốc
                                </Button>
                            </div>
                        </>
                    )}
                </Form.List>

                <div className="text-right mt-6">
                    <Button onClick={onClose} style={{ marginRight: 8 }}>
                        Huỷ
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                    >
                        Lưu đơn thuốc
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}