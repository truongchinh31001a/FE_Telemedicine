'use client';

import { Card, Table, Button } from 'antd';
import { ReloadOutlined, EyeOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import '@ant-design/v5-patch-for-react-19';

export default function PrescriptionTab({ data = [] }) {
    const { t } = useTranslation();

    const columns = [
        {
            title: t('prescription.request_date'),
            dataIndex: 'requestDate',
            key: 'requestDate',
        },
        {
            title: t('prescription.execute_date'),
            dataIndex: 'executeDate',
            key: 'executeDate',
        },
        {
            title: t('prescription.doctor'),
            dataIndex: 'doctor',
            key: 'doctor',
        },
        {
            title: '',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => console.log('Chi tiết đơn thuốc:', record)}
                />
            ),
        },
    ];

    return (
        <div className="w-full">
            <Card
                title={t('prescription.title')}
                extra={
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={() => console.log('Refresh')}
                    />
                }
            >
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="key"
                    pagination={false}
                    size="middle"
                />
            </Card>
        </div>
    );
}
