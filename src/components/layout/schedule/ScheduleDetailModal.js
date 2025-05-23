'use client';

import { Modal, Descriptions, Button, Space, message } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

const ScheduleDetailModal = ({ open, onClose, data, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);


  const handleEdit = () => {
    if (onEdit) {
      onEdit(data);
    } else {
      message.info(t('schedule_detail.edit_clicked'));
    }
  };

  const handleDelete = async () => {
    Modal.confirm({
      title: t('schedule_detail.confirm_delete_title'),
      content: t('schedule_detail.confirm_delete_content'),
      okText: t('schedule_detail.delete'),
      okType: 'danger',
      cancelText: t('schedule_detail.cancel'),
      onOk: async () => {
        setLoading(true);
        try {
          if (onDelete) {
            await onDelete(data.scheduleId); // 👈 cần scheduleId để xoá
          }
          message.success(t('schedule_detail.deleted'));
          onClose?.();
        } catch (err) {
          console.error(err);
          message.error('Delete failed');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // Kiểm tra nếu data và members tồn tại, nếu không sử dụng giá trị mặc định
  const members = data?.members?.map(member => member.fullName).join(', ') || t('schedule_detail.default_members');

  return (
    <Modal
      title={t('schedule_detail.title')}
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      {data && (
        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label={t('schedule_detail.event_name')}>
            {/* Dùng note nếu không có eventName */}
            {data.note || t('schedule_detail.no_event_name')}
          </Descriptions.Item>
          <Descriptions.Item label={t('schedule_detail.time')}>
            {/* Sử dụng workDate thay vì date */}
            {`${dayjs(data.workDate).format('YYYY-MM-DD')} ${data.startTime} - ${data.endTime}`}
          </Descriptions.Item>
          <Descriptions.Item label={t('schedule_detail.department')}>
            {data.department || t('schedule_detail.no_department')}
          </Descriptions.Item>
          <Descriptions.Item label={t('schedule_detail.location')}>
            {data.room || t('schedule_detail.default_location')}
          </Descriptions.Item>
          <Descriptions.Item label={t('schedule_detail.note')}>
            {data.note || t('schedule_detail.no_note')}
          </Descriptions.Item>
          <Descriptions.Item label={t('schedule_detail.members')}>
            {members}
          </Descriptions.Item>
        </Descriptions>
      )}

      <Space className="mt-4" align="center">
        <Button type="primary" onClick={handleEdit}>
          {t('schedule_detail.edit')}
        </Button>
        <Button danger onClick={handleDelete} loading={loading}>
          {t('schedule_detail.delete')}
        </Button>
      </Space>
    </Modal>
  );
};

export default ScheduleDetailModal;
