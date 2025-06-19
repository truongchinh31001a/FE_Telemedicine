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

export default function UserPanel({ users = [], onSelectUser, onReload, allowAdd = true }) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const getFullName = (user) => {
    if (user.FullName) return user.FullName;
    return `${user.lastName ?? ''} ${user.middleName ?? ''} ${user.firstName ?? ''}`.trim();
  };

  const filtered = users.filter((user) =>
    getFullName(user).toLowerCase().includes(search.toLowerCase())
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
        {allowAdd && (
          <Button
            icon={<PlusOutlined />}
            style={{ borderColor: '#34c38f', color: '#34c38f' }}
            onClick={() => onSelectUser?.(null)}
          >
            {t('hospital_user.add')}
          </Button>
        )}

        {/* <Button
          icon={<UploadOutlined />}
          style={{ borderColor: '#027bff', color: '#027bff' }}
        >
          {t('hospital_user.import')}
        </Button> */}
      </div>

      {/* Tìm kiếm */}
      <div className="flex gap-2">
        <Input
          placeholder={t('hospital_user.search')}
          value={search}
          prefix={<SearchOutlined className="text-gray-400" />}
          onChange={(e) => setSearch(e.target.value)}
          className="border-none bg-gray-100"
        />
      </div>

      {/* Danh sách người dùng */}
      <div className="space-y-2 mt-4 max-h-[500px] overflow-y-auto pr-1">
        {paginated.map((user) => (
          <div
            key={user.UserID}
            onClick={() => onSelectUser?.(user)}
            className="flex items-center bg-white p-3 shadow-sm rounded-md border border-gray-100 cursor-pointer hover:bg-gray-50 transition"
          >
            <div className="w-1/5 flex justify-center">
              <Avatar src={user.avatar ?? null} size={50}>
                {getFullName(user).charAt(0)}
              </Avatar>
            </div>
            <div className="w-4/5 space-y-1">
              <p className="text-base font-medium">{getFullName(user)}</p>
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
