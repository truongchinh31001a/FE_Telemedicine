'use client';

import { Modal, Descriptions, Button, Space, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import JoinRoomButton from '../JoinButton';
import dayjs from 'dayjs';

const AppointmentDetailModal = ({ open, onClose, data, onApprove, onReject, actionLoading }) => {
    const { t } = useTranslation();

    const getStatusTagColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'gold';
            case 'confirmed': return 'green';
            case 'canceled': return 'red';
            default: return 'default';
        }
    };

    const handleApprove = () => {
        Modal.confirm({
            title: t('appointment_detail.confirm_approve_title'),
            content: t('appointment_detail.confirm_approve_content'),
            okText: t('appointment_detail.approve'),
            cancelText: t('appointment_detail.cancel'),
            onOk: async () => {
                await onApprove();
                onClose();
            },
        });
    };

    const handleReject = () => {
        Modal.confirm({
            title: t('appointment_detail.confirm_reject_title'),
            content: t('appointment_detail.confirm_reject_content'),
            okText: t('appointment_detail.reject'),
            okType: 'danger',
            cancelText: t('appointment_detail.cancel'),
            onOk: async () => {
                await onReject();
                onClose();
            },
        });
    };

    return (
        <Modal
            title={t('appointment_detail.title')}
            open={open}
            onCancel={onClose}
            footer={null}
            width={600}
            destroyOnClose
        >
            {data && (
                <Descriptions bordered column={1} size="small">
                    <Descriptions.Item label={t('appointment_detail.doctor')}>
                        {data.doctor_name || `BS ${data.staff_id}`}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('appointment_detail.patient')}>
                        {data.patient_name || `BN ${data.patient_id}`}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('appointment_detail.date')}>
                        {data.work_date ? dayjs(data.work_date).format('DD/MM/YYYY') : t('appointment_detail.no_date')}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('appointment_detail.time')}>
                        {data.start_time && data.end_time
                            ? `${dayjs(data.start_time, 'HH:mm:ss').format('HH:mm')} - ${dayjs(data.end_time, 'HH:mm:ss').format('HH:mm')}`
                            : t('appointment_detail.no_time')}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('appointment_detail.type')}>
                        {data.type || t('appointment_detail.default_type')}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('appointment_detail.room')}>
                        {data.room || t('appointment_detail.default_room')}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('appointment_detail.status')}>
                        <Tag color={getStatusTagColor(data.status)}>
                            {data.status?.toUpperCase()}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label={t('appointment_detail.note')}>
                        {data.note || t('appointment_detail.no_note')}
                    </Descriptions.Item>
                </Descriptions>
            )}

            <Space className="mt-4" align="center">
                <Button
                    danger
                    onClick={handleReject}
                    loading={actionLoading}
                >
                    {t('appointment_detail.reject')}
                </Button>
                {data && data.status?.toLowerCase() === 'đã duyệt' && (
                    <JoinRoomButton
                        roomName={data.room}
                        userName={data.doctor_name}
                        patientId={data.patient_id}
                        recordId={data.record_id}
                        appointmentId={data.appointment_id}
                        openInNewTab={true}
                        buttonText={t('appointment_detail.join_room')}
                        type="default"
                    />
                )}
            </Space>
        </Modal>
    );
};

export default AppointmentDetailModal;