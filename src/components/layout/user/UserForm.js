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
import { useEffect } from 'react';

export default function UserForm({ onSubmit, initialValues }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    const payload = {
      ...values,
      fullName: `${values.lastName || ''} ${values.middleName || ''} ${values.firstName || ''}`.trim(),
      dateOfBirth: values.dateOfBirth?.format('YYYY-MM-DD'),
      cccdIssueDate: values.cccdIssuedDate?.format('YYYY-MM-DD'),
      cccdExpiredDate: values.cccdExpiredDate?.format('YYYY-MM-DD'),
      hireDate: values.hireDate?.format('YYYY-MM-DD'),
    };

    onSubmit?.(payload);
    form.resetFields();
    message.success(t('form.submitted'));
  };

  const normFile = (e) => (Array.isArray(e) ? e : e?.fileList);

  useEffect(() => {
    if (initialValues) {
      const wrapFile = (url) =>
        url
          ? [
              {
                uid: '-1',
                name: 'uploaded.jpg',
                status: 'done',
                url,
              },
            ]
          : [];

      const patched = {
        ...initialValues,
        dateOfBirth: initialValues.dateOfBirth ? dayjs(initialValues.dateOfBirth) : undefined,
        cccdIssuedDate: initialValues.cccdIssuedDate ? dayjs(initialValues.cccdIssuedDate) : undefined,
        cccdExpiredDate: initialValues.cccdExpiredDate ? dayjs(initialValues.cccdExpiredDate) : undefined,
        hireDate: initialValues.hireDate ? dayjs(initialValues.hireDate) : undefined,

        avatar: wrapFile(initialValues.avatar),
        cccdFrontImage: wrapFile(initialValues.CCCDFront),
        cccdBackImage: wrapFile(initialValues.CCCDBack),
      };

      form.setFieldsValue(patched);
    }
  }, [initialValues, form]);

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={handleFinish}
      className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5"
    >
      <Card
        title={t('user_form.account_info')}
        extra={
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
            {t('form.save')}
          </Button>
        }
      >
        <Form.Item
          label={t('user_form.avatar')}
          name="avatar"
          valuePropName="fileList"
          getValueFromEvent={normFile}
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

        <Form.Item label={t('user_form.username')} name="username" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label={t('user_form.email')} name="email" rules={[{ type: 'email' }]}>
          <Input />
        </Form.Item>
        <Form.Item label={t('user_form.password')} name="password" rules={[{ required: true }]}>
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

        <Form.Item label={t('user_form.role')} name="roleId">
          <Select
            options={[
              { label: 'Admin', value: 1 },
              { label: 'Bác sĩ', value: 2 },
              { label: 'Y tá', value: 3 },
            ]}
          />
        </Form.Item>

        <Form.Item label={t('user_form.department')} name="departmentId">
          <Select
            options={[
              { label: 'Khoa Nội', value: 1 },
              { label: 'Khoa Ngoại', value: 2 },
              { label: 'Khoa Nhi', value: 3 },
              { label: 'Cấp cứu', value: 4 },
              { label: 'Phòng khám', value: 5 },
            ]}
          />
        </Form.Item>
      </Card>

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
              { label: t('user_form.male'), value: 'Nam' },
              { label: t('user_form.female'), value: 'Nữ' },
            ]}
          />
        </Form.Item>

        <Form.Item label={t('user_form.phone')} name="phone">
          <Input />
        </Form.Item>

        <Form.Item label={t('user_form.address')} name="address">
          <Input />
        </Form.Item>

        <Form.Item label={t('user_form.hometown')} name="hometown">
          <Input />
        </Form.Item>

        <Form.Item label={t('user_form.ethnicity')} name="ethnicity">
          <Input />
        </Form.Item>

        <Form.Item label={t('user_form.nationality')} name="nationality">
          <Input />
        </Form.Item>

        <Form.Item label={t('user_form.position')} name="position">
          <Input />
        </Form.Item>

        <Form.Item label={t('user_form.hire_date')} name="hireDate">
          <DatePicker className="w-full" />
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

        <Form.Item label={t('user_form.cccd_expired_date')} name="cccdExpiredDate">
          <DatePicker className="w-full" />
        </Form.Item>

        <Form.Item
          label={t('user_form.cccd_front_image')}
          name="cccdFrontImage"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            maxCount={1}
            listType="picture"
            beforeUpload={() => false}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>{t('form.upload')}</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          label={t('user_form.cccd_back_image')}
          name="cccdBackImage"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            maxCount={1}
            listType="picture"
            beforeUpload={() => false}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>{t('form.upload')}</Button>
          </Upload>
        </Form.Item>
      </Card>
    </Form>
  );
}
