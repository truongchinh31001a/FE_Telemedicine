'use client';

import { Card, Table, Button } from 'antd';
import { ReloadOutlined, EyeOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import '@ant-design/v5-patch-for-react-19';

export default function ImagingTab({ data = [] }) {
  const { t } = useTranslation();

  const columns = [
    {
      title: t('imaging.request_date'),
      dataIndex: 'requestDate',
      key: 'requestDate',
    },
    {
      title: t('imaging.execute_date'),
      dataIndex: 'executeDate',
      key: 'executeDate',
    },
    {
      title: t('imaging.doctor'),
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
          onClick={() => console.log('Chi tiết hình ảnh:', record)}
        />
      ),
    },
  ];

  return (
    <div className="w-full">
      <Card
        title={t('imaging.title')}
        extra={
          <Button icon={<ReloadOutlined />} onClick={() => console.log('Refresh')} />
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
