'use client';

import { Button, Input, Select, Avatar, Pagination } from 'antd';
import {
  ReloadOutlined,
  UploadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const pageSize = 5;

const MedicalRecordPanel = ({ records = [], onSelectRecord, selectedId }) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  const filtered = records.filter((record) => {
    const name = record.name?.toLowerCase() ?? '';
    const matchSearch = name.includes(search.toLowerCase());
    const matchFilter = filter ? record.membershipType === filter : true;
    return matchSearch && matchFilter;
  });

  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="w-[410px] bg-white border border-gray-200 rounded-lg p-4 space-y-4 mt-5">
      {/* Hàng 1: Nút thao tác */}
      <div className="flex justify-end gap-2">
        <Button icon={<ReloadOutlined />} type="text" />
        <Button
          icon={<UploadOutlined />}
          style={{ borderColor: '#027bff', color: '#027bff' }}
        >
          {t('medical_record.import')}
        </Button>
      </div>

      {/* Hàng 2: Tìm kiếm + lọc */}
      <div className="flex gap-2">
        <Input
          placeholder={t('medical_record.search')}
          value={search}
          prefix={<SearchOutlined className="text-gray-400" />}
          onChange={(e) => setSearch(e.target.value)}
          className="border-none bg-gray-100"
        />
        <Select
          placeholder={t('medical_record.filter')}
          allowClear
          style={{ minWidth: 100 }}
          onChange={setFilter}
          value={filter}
          options={[
            { label: 'VIP', value: 'VIP' },
            { label: 'Thường', value: 'Thường' },
          ]}
          className="border-none bg-gray-100"
        />
      </div>

      {/* Hàng 3: Danh sách hồ sơ */}
      <div className="space-y-2 mt-4 max-h-[500px] overflow-y-auto pr-1">
        {paginated.map((user) => (
          <div
            key={user.id}
            onClick={() => onSelectRecord?.(user)}
            className={`flex items-center p-3 shadow-sm rounded-md border cursor-pointer transition
              ${selectedId === user.id
                ? 'bg-blue-50 border-blue-400'
                : 'bg-white hover:bg-gray-50 border-gray-100'}`}
          >
            <div className="w-1/5 flex justify-center">
              <Avatar src={user.avatar} size={50} />
            </div>
            <div className="w-4/5 space-y-1">
              <p className="text-base font-medium">{user.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Hàng 4: Pagination */}
      <div className="text-right pt-2 flex justify-center">
        <Pagination
          size="small"
          current={currentPage}
          pageSize={pageSize}
          total={filtered.length}
          onChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default MedicalRecordPanel;
