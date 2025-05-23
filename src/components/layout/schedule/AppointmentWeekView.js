'use client';

import { Card, Tooltip, Tag } from 'antd';
import dayjs from 'dayjs';
import { useMemo, useState, useEffect } from 'react';
import AppointmentDetailModal from './AppointmentDetailModal';

const getColorByType = (type) => {
    switch (type) {
        case 'Lịch khám ngoại trú': return '#d3d3d3';
        case 'Lịch khám nội trú': return '#86cefa';
        case 'Lịch mổ': return '#ffa501';
        case 'Lịch họp': return '#34c28f';
        case 'Lịch trực': return '#ffb6c1';
        case 'Lịch khác': return '#e6e6fa';
        default: return 'gray';
    }
};

const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

const AppointmentWeekView = ({ data = [], startDate, onEventClick }) => {
    const [currentHour, setCurrentHour] = useState(dayjs().format('HH:00'));
    const [today, setToday] = useState(dayjs().format('YYYY-MM-DD'));

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentHour(dayjs().format('HH:00'));
            setToday(dayjs().format('YYYY-MM-DD'));
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    const days = useMemo(() => {
        const base = dayjs(startDate);
        const startOfWeek = base.startOf('week').add(1, 'day');
        return Array.from({ length: 7 }, (_, i) =>
            startOfWeek.add(i, 'day').format('YYYY-MM-DD')
        );
    }, [startDate]);

    const getScheduleAt = (date, time) => {
        return data.filter((item) => item.date === date && item.time === time);
    };

    return (
        <div className="overflow-x-auto rounded-md bg-white border border-gray-200 max-h-[800px] overflow-y-auto">
            <div className="grid" style={{ gridTemplateColumns: '100px repeat(7, 1fr)' }}>
                <div className="border border-gray-200 p-2 font-medium text-center bg-gray-50">Giờ</div>
                {days.map((d) => (
                    <div
                        key={d}
                        className={`border border-gray-200 p-2 font-medium text-center bg-gray-50 ${d === today ? 'bg-yellow-50 font-bold text-blue-700' : ''
                            }`}
                    >
                        {dayjs(d).format('ddd DD/MM')}
                    </div>
                ))}

                {hours.map((h) => (
                    <div key={h} className="contents">
                        <div
                            className={`border border-gray-200 p-2 text-sm text-center bg-gray-50 ${h === currentHour ? 'bg-yellow-100 font-semibold' : ''
                                }`}
                        >
                            {h}
                        </div>
                        {days.map((d) => (
                            <div
                                key={d + h}
                                className={`border border-gray-200 p-1 h-[70px] relative ${d === today && h === currentHour ? 'bg-red-100' : ''
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
                                            onClick={() => onEventClick(s.fullData)}
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
        </div>
    );
};

export default AppointmentWeekView;
