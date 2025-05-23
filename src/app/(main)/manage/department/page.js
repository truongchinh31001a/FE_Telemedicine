'use client';

import { useEffect, useState } from 'react';
import { Spin, message } from 'antd';
import DepartmentPanel from '@/components/layout/department/DepartmentPanel';
import DepartmentInfo from '@/components/layout/department/DepartmentInfo';
import fakeDepartmentData from '@/data/fakeDepartmentData'; // 🔁 import dữ liệu mẫu

export default function DepartmentPage() {
    const [departments, setDepartments] = useState([]);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchDepartments = async () => {
        setLoading(true);
        try {
            const token = document.cookie.match(/token=([^;]+)/)?.[1];
            // const res = await fetch('http://192.168.1.37:3000/departments', {
            //   headers: {
            //     Authorization: `Bearer ${token}`,
            //   },
            // });
            // const data = await res.json();
            // setDepartments(data);

            // 👇 Dùng dữ liệu giả thay thế API
            setDepartments(fakeDepartmentData);
        } catch (err) {
            message.error('Không thể tải danh sách phòng ban');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    return (
        <div className="flex gap-6 w-full">
            {/* Sidebar cố định */}
            <div className="w-[410px] shrink-0">
                <DepartmentPanel
                    departments={departments}
                    onSelectdepartment={setSelected}
                    onReload={fetchDepartments}
                />
            </div>

            {/* Nội dung chiếm toàn bộ còn lại */}
            <div className="flex-1">
                {selected && (
                    <DepartmentInfo
                        department={selected}
                        members={selected.members || []}
                        relatedDepartments={selected.relatedDepartments || []}
                    />
                )}
            </div>
        </div>
    );
}
