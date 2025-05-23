'use client';

import {
    Card,
    Form,
    Input,
    Select,
    DatePicker,
    Button,
    Upload,
    message,
} from 'antd';
import { UploadOutlined, SaveOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

export default function PatientForm({ onSubmit }) {
    const { t } = useTranslation();
    const [form] = Form.useForm();

    const handleFinish = (values) => {
        const extractFileOrNull = (field) =>
            Array.isArray(values[field]) && values[field].length > 0
                ? values[field]
                : null;

        const payload = {
            ...values,
            DateOfBirth: values.DateOfBirth?.format('YYYY-MM-DD'),
            CCCDIssueDate: values.CCCDIssueDate?.format('YYYY-MM-DD'),
            CCCDExpiredDate: values.CCCDExpiredDate?.format('YYYY-MM-DD'),
            Image: extractFileOrNull('Image'),
            CCCDFront: extractFileOrNull('CCCDFront'),
            CCCDBack: extractFileOrNull('CCCDBack'),
        };

        onSubmit?.(payload);
        form.resetFields();
        message.success(t('form.submitted') || 'Đã gửi thông tin');
    };

    const uploadField = (name, label) => (
        <Form.Item
            label={label}
            name={name}
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
        >
            <Upload maxCount={1} listType="picture-card" beforeUpload={() => false}>
                <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>{t('form.upload') || 'Tải lên'}</div>
                </div>
            </Upload>
        </Form.Item>
    );

    return (
        <Form
            layout="vertical"
            form={form}
            onFinish={handleFinish}
            initialValues={{ Gender: 'Nữ', Nationality: 'Việt Nam', Ethnicity: 'Kinh' }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5"
        >
            {/* Thông tin định danh */}
            <Card
                title="Thông tin định danh"
                extra={
                    <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                        {t('form.save') || 'Lưu'}
                    </Button>
                }
            >
                <Form.Item
                    label="Họ và tên"
                    name="FullName"
                    rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item label="Ngày sinh" name="DateOfBirth">
                    <DatePicker className="w-full" />
                </Form.Item>

                <Form.Item label="Giới tính" name="Gender">
                    <Select
                        options={[
                            { value: 'Nam', label: 'Nam' },
                            { value: 'Nữ', label: 'Nữ' },
                            { value: 'Khác', label: 'Khác' },
                        ]}
                    />
                </Form.Item>

                <Form.Item label="Số điện thoại" name="Phone">
                    <Input />
                </Form.Item>

                <Form.Item label="Địa chỉ" name="Address">
                    <Input />
                </Form.Item>

                <Form.Item label="Quê quán" name="Hometown">
                    <Input />
                </Form.Item>

                <Form.Item label="Nghề nghiệp" name="Job">
                    <Input />
                </Form.Item>

                {uploadField('Image', 'Ảnh đại diện')}
            </Card>

            {/* Thông tin CCCD */}
            <Card title="Thông tin căn cước công dân">
                <Form.Item label="Số CCCD" name="CCCD">
                    <Input />
                </Form.Item>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item label="Ngày cấp" name="CCCDIssueDate">
                        <DatePicker className="w-full" />
                    </Form.Item>
                    <Form.Item label="Nơi cấp" name="CCCDIssuePlace">
                        <Input />
                    </Form.Item>
                </div>

                <Form.Item label="Ngày hết hạn" name="CCCDExpiredDate">
                    <DatePicker className="w-full" />
                </Form.Item>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {uploadField('CCCDFront', 'Ảnh CCCD mặt trước')}
                    {uploadField('CCCDBack', 'Ảnh CCCD mặt sau')}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item label="Quốc tịch" name="Nationality">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Dân tộc" name="Ethnicity">
                        <Input />
                    </Form.Item>
                </div>
            </Card>
        </Form>
    );
}
