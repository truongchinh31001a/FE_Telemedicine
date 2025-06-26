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
import debounce from 'lodash/debounce';
dayjs.extend(isBetween);
dayjs.extend(utc);
import { CalendarOutlined } from '@ant-design/icons';
import '@ant-design/v5-patch-for-react-19';

import ScheduleWeekView from '@/components/layout/schedule/ScheduleWeekView';
import AddScheduleModal from '@/components/layout/schedule/AddScheduleModal';

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
  }, [ready, selectedDate, department]);

  const handleSearch = debounce(() => {
    const startOfWeek = selectedDate.startOf('week').add(1, 'day');
    const endOfWeek = startOfWeek.add(6, 'day');

    const filtered = allSchedules.filter((item) => {
      const itemDate = dayjs(item.workDate);
      return (
        itemDate.isBetween(startOfWeek, endOfWeek, 'day', '[]') &&
        (!department || item.departmentName?.toLowerCase().includes(department.toLowerCase())) &&
        (!doctorName || item.staffName?.toLowerCase().includes(doctorName.toLowerCase()))
      );
    });

    setFilteredData(filtered);
  }, 300);

  useEffect(() => {
    handleSearch();
  }, [selectedDate, department, doctorName, mode, allSchedules]);

  const fetchSchedules = async () => {
    try {
      const fromDate = selectedDate.startOf('week').add(1, 'day').format('YYYY-MM-DD');
      const toDate = selectedDate.endOf('week').add(1, 'day').format('YYYY-MM-DD');
      const departmentMap = { 'nội': 1, 'ngoại': 2 };
      const departmentId = departmentMap[department] || 2;

      const response = await fetch(`/api/proxy/schedule/available-slots?departmentId=${departmentId}&fromDate=${fromDate}&toDate=${toDate}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to fetch available slots');

      const data = await response.json();

      const formatted = data.map(item => ({
        workDate: item.work_date,
        startTime: item.start_time,
        endTime: item.end_time,
        staffName: item.staff_name,
        departmentName: item.department_name,
      }));

      setAllSchedules(formatted);
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
        />
      </div>
    </div>
  );
};

export default WorkSchedulePage;
