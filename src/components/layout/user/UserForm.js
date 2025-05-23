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

export default function UserForm({ onSubmit }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    const payload = {
      ...values,
      dateOfBirth: values.dateOfBirth?.format('YYYY-MM-DD'),
      cccdIssuedDate: values.cccdIssuedDate?.format('YYYY-MM-DD'),
    };

    onSubmit?.(payload);
    form.resetFields();
    message.success(t('form.submitted'));
  };

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={handleFinish}
      initialValues={{ gender: 'Nam', role: 'Bác sĩ', status: 'active' }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5"
    >
      {/* Thông tin tài khoản */}
      <Card
        title={t('user_form.account_info')}
        extra={
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
            {t('form.save')}
          </Button>
        }
      >
        {/* Avatar Upload */}
        <Form.Item
          label={t('user_form.avatar')}
          name="avatar"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
        >
          <Upload
            maxCount={1}
            listType="picture-card"
            beforeUpload={() => false}
            accept="image/*"
          >
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>{t('form.upload')}</div>
            </div>
          </Upload>
        </Form.Item>

        <Form.Item
          label={t('user_form.username')}
          name="username"
          rules={[{ required: true, message: t('form.required') }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Email" name="email" rules={[{ type: 'email' }]}>
          <Input />
        </Form.Item>

        <Form.Item label={t('user_form.role')} name="role">
          <Select
            options={[
              { value: 'Bác sĩ', label: 'Bác sĩ' },
              { value: 'Y tá', label: 'Y tá' },
            ]}
          />
        </Form.Item>

        <Form.Item label={t('user_form.status')} name="status">
          <Select
            options={[
              { value: 'active', label: 'Hoạt động' },
              { value: 'inactive', label: 'Ngừng' },
            ]}
          />
        </Form.Item>

        <Form.Item label={t('user_form.managed_by')} name="managedBy">
          <Input />
        </Form.Item>

        <Form.Item label={t('user_form.password')} name="password">
          <Input.Password />
        </Form.Item>

        <Form.Item
          label={t('user_form.confirm_password')}
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: t('form.confirm_password_required') },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(t('form.password_mismatch')));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
      </Card>

      {/* Thông tin người dùng */}
      <Card title={t('user_form.user_info')}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Form.Item label={t('user_form.last_name')} name="lastName">
            <Input />
          </Form.Item>
          <Form.Item label={t('user_form.middle_name')} name="middleName">
            <Input />
          </Form.Item>
          <Form.Item label={t('user_form.first_name')} name="firstName">
            <Input />
          </Form.Item>
        </div>

        <Form.Item label={t('user_form.date_of_birth')} name="dateOfBirth">
          <DatePicker className="w-full" />
        </Form.Item>

        <Form.Item label={t('user_form.gender')} name="gender">
          <Select
            options={[
              { value: 'Nam', label: 'Nam' },
              { value: 'Nữ', label: 'Nữ' },
            ]}
          />
        </Form.Item>

        <Form.Item label={t('user_form.phone')} name="phone">
          <Input />
        </Form.Item>

        <Form.Item label={t('user_form.address')} name="address">
          <Input />
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Form.Item label={t('user_form.cccd')} name="cccd">
            <Input />
          </Form.Item>
          <Form.Item label={t('user_form.cccd_issued_date')} name="cccdIssuedDate">
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item label={t('user_form.cccd_issued_place')} name="cccdIssuedPlace">
            <Input />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Form.Item label={t('user_form.occupation')} name="occupation">
            <Input />
          </Form.Item>
          <Form.Item label={t('user_form.nationality')} name="nationality">
            <Input />
          </Form.Item>
          <Form.Item label={t('user_form.ethnicity')} name="ethnicity">
            <Input />
          </Form.Item>
        </div>
      </Card>
    </Form>
  );
}
