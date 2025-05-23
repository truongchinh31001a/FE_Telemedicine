'use client';

import { Button, Input, Avatar, Pagination } from 'antd';
import {
  ReloadOutlined,
  PlusOutlined,
  UploadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '@ant-design/v5-patch-for-react-19';

const pageSize = 5;

export default function DepartmentPanel({ departments = [], onSelectdepartment, onReload }) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filtered = departments.filter((d) =>
    d.DepartmentName?.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="w-[410px] bg-white border border-gray-200 rounded-lg p-4 space-y-4 mt-5">
      {/* Nút chức năng */}
      <div className="flex justify-end gap-2">
        <Button icon={<ReloadOutlined />} type="text" onClick={onReload} />
        <Button
          icon={<PlusOutlined />}
          style={{ borderColor: '#34c38f', color: '#34c38f' }}
          onClick={() => onSelectdepartment?.(null)}
        >
          {t('department_panel.add') || 'Thêm'}
        </Button>
        <Button
          icon={<UploadOutlined />}
          style={{ borderColor: '#027bff', color: '#027bff' }}
        >
          {t('department_panel.import') || 'Nhập'}
        </Button>
      </div>

      {/* Tìm kiếm */}
      <div className="flex gap-2">
        <Input
          placeholder={t('department_panel.search') || 'Tìm kiếm'}
          value={search}
          prefix={<SearchOutlined className="text-gray-400" />}
          onChange={(e) => setSearch(e.target.value)}
          className="border-none bg-gray-100"
        />
      </div>

      {/* Danh sách chuyên ngành */}
      <div className="space-y-2 mt-4 max-h-[500px] overflow-y-auto pr-1">
        {paginated.map((department) => (
          <div
            key={department.DepartmentID}
            onClick={() => onSelectdepartment?.(department)}
            className="flex items-center bg-white p-3 shadow-sm rounded-md border border-gray-100 cursor-pointer hover:bg-gray-50 transition"
          >
            <div className="w-1/5 flex justify-center">
              <Avatar src={department.avatar ?? null} size={50}>
                {department.DepartmentName?.charAt(0) ?? '?'}
              </Avatar>
            </div>
            <div className="w-4/5 space-y-1">
              <p className="text-base font-medium">{department.DepartmentName}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Phân trang */}
      <div className="text-right pt-2 flex justify-center">
        <Pagination
          size="small"
          current={currentPage}
          pageSize={pageSize}
          total={filtered.length}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}
