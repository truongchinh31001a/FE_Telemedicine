'use client';

import { Tooltip, Tag } from 'antd';
import dayjs from 'dayjs';
import { useMemo, useState, useEffect } from 'react';
import ScheduleDetailModal from './ScheduleDetailModal';

// 🎨 Hàm ánh xạ màu theo loại lịch
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
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openModal, setOpenModal] = useState(false);
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

  // 🌟 CHUYỂN DỮ LIỆU chuẩn theo {date, time} và xử lý cả startTime và endTime
  const transformedData = useMemo(() => {
    return data.flatMap((item) => {
      const events = [];
      
      // Thêm 7 giờ vào thời gian bắt đầu và kết thúc (UTC+7)
      const startTimeWithDate = dayjs(item.workDate).set('hour', dayjs(item.startTime, 'HH:mm').hour()).set('minute', dayjs(item.startTime, 'HH:mm').minute());
      const endTimeWithDate = dayjs(item.workDate).set('hour', dayjs(item.endTime, 'HH:mm').hour()).set('minute', dayjs(item.endTime, 'HH:mm').minute());

      let current = startTimeWithDate;  // Đã cộng 7 giờ vào startTime
      const end = endTimeWithDate;  // Đã cộng 7 giờ vào endTime

      // Kiểm tra nếu ngày tháng không hợp lệ
      if (!current.isValid() || !end.isValid()) {
        return []; // Nếu ngày tháng không hợp lệ, bỏ qua sự kiện này
      }

      // Tạo các sự kiện dựa trên startTime và endTime
      while (current.isBefore(end)) {
        events.push({
          id: item.scheduleId,
          date: item.workDate, // workDate dạng YYYY-MM-DD
          time: current.format('HH:00'), // Giờ dạng HH:00
          doctorName: item.members?.join(', '),
          department: item.departmentName,
          type: item.eventType,
          note: item.note,
          startTime: item.startTime,
          endTime: item.endTime,
          room: item.room,
        });
        current = current.add(1, 'hour'); // Tăng giờ lên
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
                    key={s.id}
                    title={`${s.doctorName} (${s.department}) - ${s.type}`}
                  >
                    <Tag
                      color={getColorByType(s.type)}
                      className="absolute top-1 left-1 truncate max-w-full cursor-pointer"
                      onClick={() => {
                        setSelectedEvent(s);
                        setOpenModal(true);
                      }}
                    >
                      {s.doctorName}
                    </Tag>
                  </Tooltip>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Modal xem chi tiết */}
      <ScheduleDetailModal
        open={openModal}
        data={selectedEvent}
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
};

export default ScheduleWeekView;
