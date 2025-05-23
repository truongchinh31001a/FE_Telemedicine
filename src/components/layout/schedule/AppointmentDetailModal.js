'use client';

import { Modal, Descriptions, Button, Space, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import JoinRoomButton from '../JoinButton';

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
                await onApprove(); // 🛠️ Xử lý Approve
                onClose();          // ✅ Đóng Modal sau khi xử lý xong
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
                await onReject(); // 🛠️ Xử lý Reject
                onClose();        // ✅ Đóng Modal sau khi xử lý xong
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
                        {data.StaffName || `BS ${data.StaffID}`}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('appointment_detail.patient')}>
                        {data.PatientName || `BN ${data.PatientID}`}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('appointment_detail.date')}>
                        {data.WorkDate ? new Date(data.WorkDate).toLocaleDateString() : t('appointment_detail.no_date')}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('appointment_detail.time')}>
                        {data.StartTime && data.EndTime
                            ? `${new Date(data.StartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(data.EndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                            : t('appointment_detail.no_time')}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('appointment_detail.type')}>
                        {data.Type || t('appointment_detail.default_type')}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('appointment_detail.room')}>
                        {data.Room || t('appointment_detail.default_room')}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('appointment_detail.status')}>
                        <Tag color={getStatusTagColor(data.Status)}>
                            {data.Status?.toUpperCase()}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label={t('appointment_detail.note')}>
                        {data.Note || t('appointment_detail.no_note')}
                    </Descriptions.Item>
                </Descriptions>
            )}

            <Space className="mt-4" align="center">
                <Button
                    type="primary"
                    onClick={handleApprove}
                    loading={actionLoading} // ✅ Nút loading khi approve/reject
                >
                    {t('appointment_detail.approve')}
                </Button>
                <Button
                    danger
                    onClick={handleReject}
                    loading={actionLoading} // ✅ Nút loading khi approve/reject
                >
                    {t('appointment_detail.reject')}
                </Button>
                {data && data.Status?.toLowerCase() === 'confirmed' && (
                    <JoinRoomButton
                        roomName={data.Room}
                        userName={data.StaffName}
                        patientId={data.PatientID}
                        recordId={data.RecordID}
                        appointmentId={data.AppointmentID}
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
