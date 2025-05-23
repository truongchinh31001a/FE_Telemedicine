'use client';

import { Card, Table, Button } from 'antd';
import { ReloadOutlined, EyeOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import '@ant-design/v5-patch-for-react-19';

export default function LabTestTab({ data = [] }) {
  const { t } = useTranslation();

  const columns = [
    {
      title: t('lab.request_date'),
      dataIndex: 'requestDate',
      key: 'requestDate',
    },
    {
      title: t('lab.execute_date'),
      dataIndex: 'executeDate',
      key: 'executeDate',
    },
    {
      title: t('lab.doctor'),
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
          onClick={() => console.log('Chi tiết xét nghiệm:', record)}
        />
      ),
    },
  ];

  return (
    <div className="w-full">
      <Card
        title={t('lab.title')}
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
