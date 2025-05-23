'use client';

import {
  Table,
  Checkbox,
  Typography,
  Button,
  Divider,
  Modal,
} from 'antd';
import {
  BorderOutlined,
  MinusOutlined,
  EditOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const { Title } = Typography;

const initialPermissions = [
  { key: 'hospital_user', label: 'permission.hospital_user' },
  { key: 'patient_user', label: 'permission.patient_user' },
  { key: 'department', label: 'permission.department' },
  { key: 'doctor_info', label: 'permission.doctor_info' },
  { key: 'patient_info', label: 'permission.patient_info' },
  { key: 'medical_record', label: 'permission.medical_record' },
  { key: 'work_schedule', label: 'permission.work_schedule' },
  { key: 'appointment', label: 'permission.appointment' },
  { key: 'drug_catalog', label: 'permission.drug_catalog' },
  { key: 'disease_catalog', label: 'permission.disease_catalog' },
  { key: 'lab_test_catalog', label: 'permission.lab_test_catalog' },
  { key: 'imaging_catalog', label: 'permission.imaging_catalog' },
  { key: 'warehouse', label: 'permission.warehouse' },
  { key: 'import', label: 'permission.import' },
  { key: 'export', label: 'permission.export' },
  { key: 'report', label: 'permission.report' },
];

const PermissionTable = () => {
  const { t } = useTranslation();
  const [editMode, setEditMode] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [data, setData] = useState(
    initialPermissions.map((perm) => ({
      key: perm.key,
      name: t(perm.label),
      all: false,
      view: false,
      create: false,
      edit: false,
      delete: false,
      total: false,
    }))
  );

  const previousData = useRef(data);

  const handleChange = (recordKey, field, checked) => {
    const newData = data.map((item) => {
      if (item.key === recordKey) {
        const updated = { ...item, [field]: checked };

        if (field === 'all') {
          updated.view = updated.create = updated.edit = updated.delete = updated.total = checked;
        }

        const allChecked = ['view', 'create', 'edit', 'delete', 'total'].every(
          (k) => updated[k]
        );
        updated.all = allChecked;

        return updated;
      }
      return item;
    });

    setData(newData);
  };

  const columns = [
    { title: t('permission.title'), dataIndex: 'name' },
    {
      title: t('permission.select_all'),
      dataIndex: 'all',
      align: 'center',
      render: (_, record) => (
        <Checkbox
          disabled={!editMode}
          checked={record.all}
          onChange={(e) => handleChange(record.key, 'all', e.target.checked)}
        />
      ),
    },
    {
      title: t('permission.view'),
      dataIndex: 'view',
      align: 'center',
      render: (_, record) => (
        <Checkbox
          disabled={!editMode}
          checked={record.view}
          onChange={(e) => handleChange(record.key, 'view', e.target.checked)}
        />
      ),
    },
    {
      title: t('permission.create'),
      dataIndex: 'create',
      align: 'center',
      render: (_, record) => (
        <Checkbox
          disabled={!editMode}
          checked={record.create}
          onChange={(e) => handleChange(record.key, 'create', e.target.checked)}
        />
      ),
    },
    {
      title: t('permission.edit'),
      dataIndex: 'edit',
      align: 'center',
      render: (_, record) => (
        <Checkbox
          disabled={!editMode}
          checked={record.edit}
          onChange={(e) => handleChange(record.key, 'edit', e.target.checked)}
        />
      ),
    },
    {
      title: t('permission.delete'),
      dataIndex: 'delete',
      align: 'center',
      render: (_, record) => (
        <Checkbox
          disabled={!editMode}
          checked={record.delete}
          onChange={(e) => handleChange(record.key, 'delete', e.target.checked)}
        />
      ),
    },
    {
      title: t('permission.total'),
      dataIndex: 'total',
      align: 'center',
      render: (_, record) => (
        <Checkbox
          disabled={!editMode}
          checked={record.total}
          onChange={(e) => handleChange(record.key, 'total', e.target.checked)}
        />
      ),
    },
  ];

  const isDataChanged = (a, b) => JSON.stringify(a) !== JSON.stringify(b);

  const handleSave = () => {
    if (isDataChanged(previousData.current, data)) {
      Modal.confirm({
        title: t('permission.confirm_title'),
        content: t('permission.confirm_content'),
        okText: t('permission.confirm_ok'),
        cancelText: t('permission.confirm_cancel'),
        onOk: () => {
          toast.success(t('permission.toast_saved'));
          setEditMode(false);
          previousData.current = data;
        },
      });
    } else {
      toast.info(t('permission.toast_nochange'));
      setEditMode(false);
    }
  };

  return (
    <div className="mt-6 border border-gray-300 rounded-md p-4 bg-white transition-all">
      <div className="flex justify-between items-center mb-2">
        <Title level={4} className="!mb-0">
          {t('permission.title')}
        </Title>
        <div className="flex gap-2">
          <Button
            type="primary"
            size="small"
            icon={editMode ? <SaveOutlined /> : <EditOutlined />}
            onClick={editMode ? handleSave : () => setEditMode(true)}
          />
          <Button
            size="small"
            icon={collapsed ? <BorderOutlined /> : <MinusOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
        </div>
      </div>

      <Divider className="my-2" />

      <div
        className="transition-all duration-500 ease-in-out overflow-hidden"
        style={{
          maxHeight: collapsed ? 0 : 600,
          opacity: collapsed ? 0 : 1,
        }}
      >
        <Table
          dataSource={data}
          columns={columns}
          pagination={false}
          bordered
          size="middle"
        />
      </div>
    </div>
  );
};

export default PermissionTable;
