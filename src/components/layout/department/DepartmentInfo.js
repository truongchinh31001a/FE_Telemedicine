'use client';

import { Card, Descriptions, Divider, Table, Avatar, Typography } from 'antd';

const { Title } = Typography;

export default function DepartmentInfo({ department, members = [], relatedDepartments = [] }) {
  return (
    <div className="flex gap-4 mt-6 w-full">
      {/* Left content: 70% */}
      <div className="w-[70%] space-y-4">
        {/* Thông tin cơ bản */}
        <Card>
          <div className="flex gap-6 items-start">
            <div>
              <Avatar src={department?.avatar} size={100} />
            </div>
            <div className="flex-1">
              <Title level={4} className="mb-2">{department?.DepartmentName || 'Tên phòng ban'}</Title>
              <Descriptions bordered column={2}>
                <Descriptions.Item label="Mã">{department?.DepartmentCode}</Descriptions.Item>
                <Descriptions.Item label="Phòng">{department?.Room}</Descriptions.Item>
                <Descriptions.Item label="Loại phòng ban">{department?.Type}</Descriptions.Item>
                <Descriptions.Item label="SĐT">{department?.Phone}</Descriptions.Item>
                <Descriptions.Item label="Email">{department?.Email}</Descriptions.Item>
                <Descriptions.Item label="Trạng thái">{department?.Status}</Descriptions.Item>
              </Descriptions>
            </div>
          </div>
        </Card>

        {/* Thông tin mô tả gộp chung */}
        <Card>
          <div className="space-y-6">
            <div>
              <Title level={5}>Giới thiệu</Title>
              <p>{department?.Description || 'Chưa có thông tin.'}</p>
            </div>

            <Divider />

            <div>
              <Title level={5}>Dịch vụ chuyên môn</Title>
              <p>{department?.Services || 'Chưa có dịch vụ chuyên môn.'}</p>
            </div>

            <Divider />

            <div>
              <Title level={5}>Nhiệm vụ chức năng</Title>
              <p>{department?.Functions || 'Chưa có nhiệm vụ chức năng.'}</p>
            </div>

            <Divider />

            <div>
              <Title level={5}>Thông tin khác</Title>
              <p>{department?.OtherInfo || 'Không có.'}</p>
            </div>

            <Divider />

            <div>
              <Title level={5}>Tệp đính kèm</Title>
              <p>{department?.Attachments || 'Không có tệp đính kèm.'}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Right content: 30% */}
      <div className="w-[30%] space-y-4">
        <Card title="Thành viên">
          <Table
            dataSource={members}
            size="small"
            pagination={false}
            rowKey="id"
            columns={[
              {
                title: '',
                dataIndex: 'avatar',
                render: (src) => <Avatar src={src} />,
                width: 40,
              },
              {
                title: 'Tên',
                dataIndex: 'name',
              },
              {
                title: 'Vai trò',
                dataIndex: 'role',
              },
            ]}
          />
        </Card>

        <Card title="Danh sách phòng ban">
          <Table
            dataSource={relatedDepartments}
            size="small"
            pagination={false}
            rowKey="code"
            columns={[
              {
                title: 'STT',
                render: (_, __, index) => index + 1,
                width: 50,
              },
              {
                title: 'Mã',
                dataIndex: 'code',
              },
              {
                title: 'Tên',
                dataIndex: 'name',
              },
            ]}
          />
        </Card>
      </div>
    </div>
  );
}
