'use client';

import { Tooltip, Tag } from 'antd';
import dayjs from 'dayjs';
import { useMemo, useState, useEffect } from 'react';

// 🎨 Hàm ánh xạ màu theo loại lịch (có thể tùy chỉnh sau)
const getColorByType = (type) => {
  switch (type) {
    case 'Khám': return '#86cefa';
    case 'Mổ': return '#ffa501';
    case 'Họp': return '#34c28f';
    case 'Trực': return '#ffb6c1';
    case 'Khác': return '#e6e6fa';
    default: return 'gray';
  }
};

// ✅ Tạo mảng giờ 24h
const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

const ScheduleWeekView = ({ data = [], startDate }) => {
  const [currentHour, setCurrentHour] = useState(dayjs().format('HH:00'));
  const [today, setToday] = useState(dayjs().format('YYYY-MM-DD'));

  // Cập nhật giờ hiện tại mỗi phút
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHour(dayjs().format('HH:00'));
      setToday(dayjs().format('YYYY-MM-DD'));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // 🌟 CHUYỂN DỮ LIỆU: sử dụng đúng trường từ WorkSchedulePage
  const transformedData = useMemo(() => {
    return data.flatMap((item) => {
      const events = [];
      const startTime = dayjs(item.workDate + 'T' + item.startTime);
      const endTime = dayjs(item.workDate + 'T' + item.endTime);
      let current = startTime;

      if (!current.isValid() || !endTime.isValid()) return [];

      while (current.isBefore(endTime)) {
        events.push({
          date: item.workDate,
          time: current.format('HH:00'),
          staffName: item.staffName,
          departmentName: item.departmentName,
          room: item.room || '',
          startTime: item.startTime,
          endTime: item.endTime,
        });
        current = current.add(1, 'hour');
      }
      return events;
    });
  }, [data]);

  const days = useMemo(() => {
    const base = dayjs(startDate);
    const startOfWeek = base.startOf('week').add(1, 'day');
    return Array.from({ length: 7 }, (_, i) =>
      startOfWeek.add(i, 'day').format('YYYY-MM-DD')
    );
  }, [startDate]);

  const getScheduleAt = (date, time) => {
    return transformedData.filter((item) => item.date === date && item.time === time);
  };

  return (
    <div className="overflow-x-auto rounded-md bg-white border border-gray-200 max-h-[800px] overflow-y-auto">
      <div className="grid" style={{ gridTemplateColumns: '100px repeat(7, 1fr)' }}>
        {/* Header */}
        <div className="border border-gray-200 p-2 font-medium text-center bg-gray-50">Giờ</div>
        {days.map((d) => (
          <div
            key={d}
            className={`border border-gray-200 p-2 font-medium text-center bg-gray-50 ${
              d === today ? 'bg-yellow-50 font-bold text-blue-700' : ''
            }`}
          >
            {dayjs(d).format('ddd DD/MM')}
          </div>
        ))}

        {/* Body */}
        {hours.map((h) => (
          <div key={h} className="contents">
            <div
              className={`border border-gray-200 p-2 text-sm text-center bg-gray-50 ${
                h === currentHour ? 'bg-yellow-100 font-semibold' : ''
              }`}
            >
              {h}
            </div>
            {days.map((d) => (
              <div
                key={d + h}
                className={`border border-gray-200 p-1 h-[70px] relative ${
                  d === today && h === currentHour ? 'bg-red-100' : ''
                }`}
              >
                {getScheduleAt(d, h).map((s) => (
                  <Tooltip
                    key={`${s.date}-${s.time}-${s.staffName}`}
                    title={`${s.staffName} (${s.departmentName})`}
                  >
                    <Tag
                      color={getColorByType('Khám')}
                      className="absolute top-1 left-1 truncate max-w-full cursor-pointer"
                    >
                      {s.staffName}
                    </Tag>
                  </Tooltip>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleWeekView;
