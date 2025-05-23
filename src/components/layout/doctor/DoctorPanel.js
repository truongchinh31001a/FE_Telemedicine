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

export default function DoctorPanel({ doctors = [], onSelectDoctor, onReload }) {
    const { t } = useTranslation();
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const getFullName = (doctor) => {
        if (doctor.FullName) return doctor.FullName;
        return `${doctor.lastName ?? ''} ${doctor.middleName ?? ''} ${doctor.firstName ?? ''}`.trim();
    };

    const filtered = doctors.filter((doctor) =>
        getFullName(doctor).toLowerCase().includes(search.toLowerCase())
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
                    onClick={() => onSelectDoctor?.(null)}
                >
                    {t('doctor_panel.add') || 'Thêm'}
                </Button>
                <Button
                    icon={<UploadOutlined />}
                    style={{ borderColor: '#027bff', color: '#027bff' }}
                >
                    {t('doctor_panel.import') || 'Nhập'}
                </Button>
            </div>

            {/* Tìm kiếm */}
            <div className="flex gap-2">
                <Input
                    placeholder={t('doctor_panel.search') || 'Tìm kiếm'}
                    value={search}
                    prefix={<SearchOutlined className="text-gray-400" />}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border-none bg-gray-100"
                />
            </div>

            {/* Danh sách bác sĩ */}
            <div className="space-y-2 mt-4 max-h-[500px] overflow-y-auto pr-1">
                {paginated.map((doctor) => (
                    <div
                        key={doctor.UserID}
                        onClick={() => onSelectDoctor?.(doctor)}
                        className="flex items-center bg-white p-3 shadow-sm rounded-md border border-gray-100 cursor-pointer hover:bg-gray-50 transition"
                    >
                        <div className="w-1/5 flex justify-center">
                            <Avatar src={doctor.avatar ?? null} size={50}>
                                {getFullName(doctor).charAt(0)}
                            </Avatar>
                        </div>
                        <div className="w-4/5 space-y-1">
                            <p className="text-base font-medium">{getFullName(doctor)}</p>
                            <p className="text-sm text-gray-500">
                                {(doctor.Specialty ?? t('doctor_panel.no_specialty')) || 'Chưa rõ chuyên khoa'}
                            </p>
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
