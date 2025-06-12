'use client';

import { useState, useEffect } from 'react';
import {
  DatePicker,
  Button,
  Select,
  Input,
  Typography,
  message,
} from 'antd';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import utc from 'dayjs/plugin/utc';
import debounce from 'lodash/debounce'; // Thêm debounce cho việc tìm kiếm
dayjs.extend(isBetween);
dayjs.extend(utc);
import { CalendarOutlined } from '@ant-design/icons';
import '@ant-design/v5-patch-for-react-19';

import ScheduleWeekView from '@/components/layout/schedule/ScheduleWeekView';
import AddScheduleModal from '@/components/layout/schedule/AddScheduleModal';
import ScheduleDetailModal from '@/components/layout/schedule/ScheduleDetailModal';

const { Title } = Typography;

const WorkSchedulePage = () => {
  const { t, i18n } = useTranslation();
  const [ready, setReady] = useState(false);

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [department, setDepartment] = useState(null);
  const [doctorName, setDoctorName] = useState('');
  const [mode, setMode] = useState(null);
  const [allSchedules, setAllSchedules] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  useEffect(() => {
    if (i18n.isInitialized) {
      setReady(true);
    } else {
      i18n.on('initialized', () => setReady(true));
    }
  }, [i18n]);

  useEffect(() => {
    if (ready) {
      fetchSchedules();
    }
  }, [ready]);

  // Đảm bảo rằng việc tìm kiếm được thực hiện sau một thời gian nhập liệu
  const handleSearch = debounce(() => {
    const startOfWeek = selectedDate.startOf('week').add(1, 'day'); // Điều chỉnh tuần bắt đầu từ Thứ Hai
    const endOfWeek = startOfWeek.add(6, 'day');

    const filtered = allSchedules.filter((item) => {
      const itemDate = dayjs(item.workDate);
      return (
        itemDate.isBetween(startOfWeek, endOfWeek, 'day', '[]') &&
        (!department || item.departmentName?.toLowerCase().includes(department.toLowerCase())) &&
        (!mode || item.eventType?.toLowerCase() === mode.toLowerCase()) &&
        (!doctorName || item.members?.some(name => name.toLowerCase().includes(doctorName.toLowerCase())))
      );
    });

    setFilteredData(filtered);
  }, 300); // Đặt thời gian debounce là 300ms

  useEffect(() => {
    handleSearch();
  }, [selectedDate, department, doctorName, mode, allSchedules]);

  const fetchSchedules = async () => {
    try {
      const response = await fetch('/api/schedules', {
        method: 'GET',
        credentials: 'include',
      });
  
      if (!response.ok) throw new Error('Failed to fetch schedules');
  
      const rawSchedules = await response.json();
  
      const cleanSchedules = rawSchedules.map(schedule => ({
        ...schedule,
        startTime: dayjs.utc(schedule.startTime).format('HH:mm'), // ✔️ Dùng utc() để không lệch giờ
        endTime: dayjs.utc(schedule.endTime).format('HH:mm'),
        workDate: dayjs.utc(schedule.workDate).format('YYYY-MM-DD'), // ✔️ Vẫn format workDate
        members: schedule.members.map(member => member.fullName) // ✔️ Lấy fullName
      }));
      
      setAllSchedules(cleanSchedules);
    } catch (error) {
      console.error(error);
      message.error('Lỗi tải lịch');
    }
  };

  const handleCreateSchedule = async (data) => {
    try {
      const response = await fetch('/api/schedules', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data
        }),
      });

      if (!response.ok) throw new Error('Failed to create schedule');

      message.success('Tạo lịch thành công!');
      setShowModal(false);
      fetchSchedules();
    } catch (error) {
      console.error(error);
      message.error('Tạo lịch thất bại!');
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    try {
      const response = await fetch(`/api/schedules/${scheduleId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to delete schedule');

      message.success('Xóa lịch thành công');
      fetchSchedules();
    } catch (error) {
      console.error(error);
      message.error('Xóa lịch thất bại');
    }
  };

  const departmentPlaceholder = t('schedule.select_department');
  const doctorPlaceholder = t('schedule.input_doctor_name');
  const modePlaceholder = t('schedule.select_mode');

  if (!ready) return null;

  return (
    <div className="space-y-6">
      {/* Bộ lọc */}
      <div className="bg-white p-4 rounded shadow flex flex-wrap gap-4 justify-between items-center">
        <span className="text-lg font-semibold">
          {selectedDate ? selectedDate.format('DD-MM-YYYY') : t('schedule.not_selected')}
        </span>

        <DatePicker
          value={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          picker="date"
          suffixIcon={<CalendarOutlined />}
          allowClear={false}
        />

        <Select
          placeholder={departmentPlaceholder}
          allowClear
          onChange={setDepartment}
          style={{ minWidth: 160 }}
          options={[{ label: t('schedule.department_internal'), value: 'nội' }, { label: t('schedule.department_surgery'), value: 'ngoại' }]}
        />

        <Input
          placeholder={doctorPlaceholder}
          value={doctorName}
          onChange={(e) => setDoctorName(e.target.value)}
          style={{ width: 200 }}
        />

        <Select
          placeholder={modePlaceholder}
          allowClear
          onChange={setMode}
          style={{ minWidth: 180 }}
          options={[
            { label: 'Khám', value: 'khám' },
            { label: 'Mổ', value: 'mổ' },
            { label: 'Họp', value: 'họp' },
            { label: 'Trực', value: 'trực' },
            { label: 'Khác', value: 'khác' },
          ]}
        />

        <Button
          type="primary"
          onClick={handleSearch}
        >
          {t('schedule.search')}
        </Button>

        <Button
          type="default"
          onClick={() => setShowModal(true)}
          style={{ backgroundColor: '#34C28E', borderColor: '#34C28E', color: 'white' }}
        >
          {t('schedule.add')}
        </Button>

        <AddScheduleModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleCreateSchedule}
        />
      </div>

      {/* Lịch */}
      <div className="bg-white p-4 rounded shadow">
        <ScheduleWeekView
          data={filteredData}
          startDate={selectedDate}
          onSelectSchedule={(schedule) => {
            setSelectedSchedule(schedule);
            setShowDetail(true);
          }}
        />
      </div>

      {/* Modal chi tiết */}
      <ScheduleDetailModal
        open={showDetail}
        onClose={() => setShowDetail(false)}
        data={selectedSchedule}
        onDelete={handleDeleteSchedule}
        onEdit={(schedule) => {
        }}
      />
    </div>
  );
};

export default WorkSchedulePage;
