'use client';

import { Modal, Form, Input, Select, DatePicker, TimePicker, Button, Row, Col } from 'antd';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

const { TextArea } = Input;

const scheduleTypes = [
  { label: 'Khám', value: 'khám' },
  { label: 'Mổ', value: 'mổ' },
  { label: 'Họp', value: 'họp' },
  { label: 'Trực', value: 'trực' },
  { label: 'Khác', value: 'khác' },
];

const AddScheduleModal = ({ open, onClose, onSubmit }) => {
  const [form] = Form.useForm();
  const [staffOptions, setStaffOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);

  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        const response = await fetch('/api/staffs', { credentials: 'include' });
        if (!response.ok) throw new Error('Failed to fetch staffs');

        const data = await response.json();
        setStaffOptions(data.map(staff => ({
          value: staff.staffId,
          label: staff.FullName,
        })));
      } catch (error) {
        console.error('Error loading staffs:', error);
      }
    };

    const fetchDepartments = async () => {
      try {
        const response = await fetch('/api/departments', { credentials: 'include' });
        if (!response.ok) throw new Error('Failed to fetch departments');

        const data = await response.json();
        setDepartmentOptions(data.map(dep => ({
          value: dep.DepartmentID,
          label: dep.DepartmentName,
        })));
      } catch (error) {
        console.error('Error loading departments:', error);
      }
    };

    if (open) {
      fetchStaffs();
      fetchDepartments();
    }
  }, [open]);

  const handleFinish = (values) => {
    const formatted = {
      ...values,
      workDate: values.workDate.format('YYYY-MM-DD'),
      startTime: values.startTime.format('HH:mm'),
      endTime: values.endTime.format('HH:mm'),
      memberIds: values.members.map(m => m.value),  // Lấy ID của member
      departmentId: values.departmentId,            // Phòng ban
    };

    // Gọi hàm onSubmit với dữ liệu đã format
    onSubmit?.(formatted);
    // Đóng modal sau khi gửi dữ liệu
    onClose?.();
    // Reset các trường trong form
    form.resetFields();
  };

  return (
    <Modal
      title="📅 Thêm lịch mới"
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Tên sự kiện" name="eventName" rules={[{ required: true }]}>
              <Input placeholder="Nhập tên sự kiện" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Loại lịch" name="eventType" rules={[{ required: true }]}>
              <Select options={scheduleTypes} placeholder="Chọn loại lịch" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Phòng ban" name="departmentId" rules={[{ required: true }]}>
              <Select
                placeholder="Chọn phòng ban"
                options={departmentOptions}
                showSearch
                optionFilterProp="label"
                filterOption={(input, option) =>
                  option.label.toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Phòng" name="room">
              <Input placeholder="Nhập số phòng" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="Ngày làm việc" name="workDate" rules={[{ required: true }]}>
              <DatePicker className="w-full" format="YYYY-MM-DD" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="Giờ bắt đầu" name="startTime" rules={[{ required: true }]}>
              <TimePicker className="w-full" format="HH:mm" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="Giờ kết thúc" name="endTime" rules={[{ required: true }]}>
              <TimePicker className="w-full" format="HH:mm" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Thành viên" name="members" rules={[{ required: true }]}>
              <Select
                mode="multiple"
                showSearch
                labelInValue
                placeholder="Tìm kiếm và chọn thành viên"
                optionFilterProp="label"
                filterOption={(input, option) =>
                  option.label.toLowerCase().includes(input.toLowerCase())
                }
                options={staffOptions}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Ghi chú" name="note">
              <TextArea rows={3} placeholder="Ghi chú thêm nếu cần" />
            </Form.Item>
          </Col>
        </Row>

        <div className="text-right">
          <Button type="primary" htmlType="submit">
            Thêm lịch
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddScheduleModal;
