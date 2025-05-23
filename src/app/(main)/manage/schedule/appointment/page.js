'use client';

import { useState, useEffect } from 'react';
import { DatePicker, Typography, Tag, Spin, Button } from 'antd';
import { CalendarOutlined, RedoOutlined } from '@ant-design/icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isBetween from 'dayjs/plugin/isBetween';

import '@ant-design/v5-patch-for-react-19';
import AppointmentDetailModal from '@/components/layout/schedule/AppointmentDetailModal';
import AppointmentWeekView from '@/components/layout/schedule/AppointmentWeekView';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

const { Title } = Typography;

export default function AppointmentSchedulePage() {
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [appointments, setAppointments] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [todaySchedules, setTodaySchedules] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const [loadingPage, setLoadingPage] = useState(false); // loading toàn trang
    const [todayLoading, setTodayLoading] = useState(false); // loading riêng cột lịch hôm nay
    const [actionLoading, setActionLoading] = useState(false); // loading riêng nút Approve/Reject

    useEffect(() => {
        fetchAppointments();
    }, []);

    useEffect(() => {
        filterAppointments(appointments);
    }, [appointments, selectedDate]);

    const fetchAppointments = async () => {
        try {
            setLoadingPage(true);
            const res = await fetch('/api/appointments');
            const data = await res.json();
            if (res.ok) {
                setAppointments(data);
                filterAppointments(data);
            } else {
                toast.error('Lỗi khi tải dữ liệu lịch hẹn!');
            }
        } catch (error) {
            console.error(error);
            toast.error('Không thể kết nối server!');
        } finally {
            setLoadingPage(false);
            setTodayLoading(false); // luôn tắt todayLoading sau fetch
        }
    };

    const filterAppointments = (dataList) => {
        const startOfWeek = selectedDate.startOf('week').add(1, 'day');
        const endOfWeek = startOfWeek.add(6, 'day');

        const filtered = dataList.filter((item) => {
            const itemDate = dayjs(item.WorkDate);
            return itemDate.isBetween(startOfWeek, endOfWeek, 'day', '[]');
        });
        setFilteredData(filtered);

        const today = selectedDate.startOf('day');
        const todayList = dataList.filter((item) =>
            dayjs(item.WorkDate).isSame(today, 'day')
        );
        setTodaySchedules(todayList);
    };

    const handleUpdateStatus = async (appointmentId, newStatus) => {
        if (!appointmentId) {
            toast.error('Không tìm thấy lịch hẹn!');
            return;
        }

        try {
            setActionLoading(true);
            const res = await fetch(`/api/appointments/${appointmentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            const result = await res.json();

            if (res.ok && result.success) {
                toast.success(newStatus === 'confirmed' ? 'Đã duyệt lịch hẹn!' : 'Đã từ chối lịch hẹn!');

                setTodayLoading(true); // ✅ Chỉ bật loading cột hôm nay

                await fetchAppointments(); // Fetch lại dữ liệu
                setSelectedAppointment(null); // Đóng modal
            } else {
                toast.success(result.message || 'Cập nhật thất bại!');
            }
        } catch (error) {
            console.error(error);
            toast.error('Lỗi kết nối máy chủ!');
        } finally {
            setActionLoading(false);
        }
    };

    const handleApprove = () => {
        if (selectedAppointment) {
            handleUpdateStatus(selectedAppointment.AppointmentID, 'confirmed');
        }
    };

    const handleReject = () => {
        if (selectedAppointment) {
            handleUpdateStatus(selectedAppointment.AppointmentID, 'canceled');
        }
    };

    const getStatusTagColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'gold';
            case 'confirmed': return 'green';
            case 'canceled': return 'red';
            default: return 'default';
        }
    };

    const mappedAppointments = filteredData.map((item) => ({
        id: item.AppointmentID,
        date: dayjs(item.WorkDate).format('YYYY-MM-DD'),
        time: dayjs.utc(item.StartTime).format('HH:00'),
        doctorName: item.StaffName || `BS ${item.StaffID}`,
        department: item.Room || 'Không rõ',
        type: item.Type || 'Lịch khác',
        fullData: item,
    }));

    return (
        <div className="space-y-6 relative">
            <ToastContainer /> {/* ✅ Toast global */}

            {loadingPage && (
                <div className="absolute inset-0 z-50 bg-white bg-opacity-60 flex justify-center items-center">
                    <Spin size="large" />
                </div>
            )}

            {/* Bộ lọc */}
            <div className="bg-white p-4 rounded shadow flex flex-wrap gap-4 items-center">
                <span className="text-lg font-semibold mr-4">
                    {selectedDate ? selectedDate.format('DD-MM-YYYY') : 'Chưa chọn ngày'}
                </span>

                <DatePicker
                    value={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    picker="date"
                    suffixIcon={<CalendarOutlined />}
                    allowClear={false}
                />
            </div>

            {/* Nội dung */}
            <div className="flex h-[calc(100vh-150px)]">
                {/* Left: Lịch hôm nay */}
                <div className="w-1/5 border-r border-gray-300 p-4 overflow-y-auto bg-white rounded-l shadow">
                    <div className="flex items-center justify-between mb-2">
                        <Title level={5} className="!mb-0">Lịch hẹn hôm nay</Title>
                        <Button
                            onClick={fetchAppointments}
                            size="small"
                            type="primary"
                            icon={<RedoOutlined />}
                            loading={loadingPage}
                        />
                    </div>

                    {todayLoading ? (
                        <div className="flex justify-center items-center h-40">
                            <Spin />
                        </div>
                    ) : todaySchedules.length > 0 ? (
                        <ul className="space-y-3">
                            {todaySchedules.map((item, index) => (
                                <li
                                    key={index}
                                    className="p-3 bg-gray-100 rounded-lg shadow-sm space-y-1 cursor-pointer hover:bg-blue-50 transition"
                                    onClick={() => setSelectedAppointment(item)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="font-medium">{item.Type}</div>
                                        <Tag color={getStatusTagColor(item.Status)}>
                                            {item.Status?.toUpperCase()}
                                        </Tag>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {dayjs.utc(item.StartTime).format('HH:mm')} - {dayjs.utc(item.EndTime).format('HH:mm')}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        Phòng: {item.Room || 'Chưa rõ'}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">Không có lịch hẹn nào hôm nay.</p>
                    )}
                </div>

                {/* Right: Lịch tuần */}
                <div className="w-4/5 border-l border-gray-300 p-4 overflow-x-auto bg-white rounded-r shadow">
                    <AppointmentWeekView
                        data={mappedAppointments}
                        startDate={selectedDate}
                        onEventClick={(event) => setSelectedAppointment(event)}
                    />
                </div>
            </div>

            {/* Modal chi tiết */}
            <AppointmentDetailModal
                open={!!selectedAppointment}
                data={selectedAppointment}
                onClose={() => setSelectedAppointment(null)}
                onApprove={handleApprove}
                onReject={handleReject}
                actionLoading={actionLoading} // ✅ truyền loading nút
            />
        </div>
    );
}
