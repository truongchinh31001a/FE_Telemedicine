// src/data/fakeScheduleData.js
const fakeScheduleData = [
    {
        "id": 1,
        "type": "Lịch khám ngoại trú",
        "department": "ngoai",
        "eventName": "Sự kiện 1",
        "location": "Phòng 202",
        "startDateTime": "2025-04-12T10:00:00",
        "endDateTime": "2025-04-12T11:00:00",
        "note": "Ghi chú cho sự kiện 1",
        "repeatDays": [
            "saturday",
            "sunday"
        ],
        "repeatFrequency": 1,
        "members": [],
        "doctorName": "Bác sĩ A",
        "date": "2025-04-12",
        "time": "13:00"
    },
    {
        "id": 2,
        "type": "Lịch họp",
        "department": "noi",
        "eventName": "Sự kiện 2",
        "location": "Phòng mổ 1",
        "startDateTime": "2025-04-20T13:00:00",
        "endDateTime": "2025-04-20T14:00:00",
        "note": "Ghi chú cho sự kiện 2",
        "repeatDays": [
            "monday",
            "wednesday"
        ],
        "repeatFrequency": 1,
        "members": [],
        "doctorName": "Bác sĩ B",
        "date": "2025-04-20",
        "time": "13:00"
    },
    {
        "id": 3,
        "type": "Lịch khám nội trú",
        "department": "noi",
        "eventName": "Sự kiện 3",
        "location": "Phòng 101",
        "startDateTime": "2025-04-18T16:00:00",
        "endDateTime": "2025-04-18T17:00:00",
        "note": "Ghi chú cho sự kiện 3",
        "repeatDays": [
            "saturday",
            "sunday"
        ],
        "repeatFrequency": 2,
        "members": [
            "bs.an@example.com"
        ],
        "doctorName": "Bác sĩ C",
        "date": "2025-04-18",
        "time": "16:00"
    },
    {
        "id": 4,
        "type": "Lịch họp",
        "department": "ngoai",
        "eventName": "Sự kiện 4",
        "location": "Phòng 101",
        "startDateTime": "2025-04-19T17:00:00",
        "endDateTime": "2025-04-19T18:00:00",
        "note": "Ghi chú cho sự kiện 4",
        "repeatDays": [
            "saturday",
            "sunday"
        ],
        "repeatFrequency": 1,
        "members": [],
        "doctorName": "Bác sĩ D",
        "date": "2025-04-19",
        "time": "17:00"
    },
    {
        "id": 5,
        "type": "Lịch khám ngoại trú",
        "department": "ngoai",
        "eventName": "Sự kiện 5",
        "location": "Phòng 101",
        "startDateTime": "2025-04-15T07:00:00",
        "endDateTime": "2025-04-15T08:00:00",
        "note": "Ghi chú cho sự kiện 5",
        "repeatDays": [],
        "repeatFrequency": null,
        "members": [
            "bs.minh@example.com",
            "yt.hoa@example.com"
        ],
        "doctorName": "Bác sĩ E",
        "date": "2025-04-15",
        "time": "07:00"
    },
    {
        "id": 6,
        "type": "Lịch trực",
        "department": "ngoai",
        "eventName": "Sự kiện 6",
        "location": "Phòng 202",
        "startDateTime": "2025-04-18T12:00:00",
        "endDateTime": "2025-04-18T13:00:00",
        "note": "Ghi chú cho sự kiện 6",
        "repeatDays": [
            "tuesday",
            "thursday"
        ],
        "repeatFrequency": 1,
        "members": [
            "bs.an@example.com"
        ],
        "doctorName": "Bác sĩ F",
        "date": "2025-04-18",
        "time": "12:00"
    },
    {
        "id": 7,
        "type": "Lịch mổ",
        "department": "ngoai",
        "eventName": "Sự kiện 7",
        "location": "Phòng 101",
        "startDateTime": "2025-04-16T13:00:00",
        "endDateTime": "2025-04-16T14:00:00",
        "note": "Ghi chú cho sự kiện 7",
        "repeatDays": [
            "saturday",
            "sunday"
        ],
        "repeatFrequency": 1,
        "members": [
            "bs.minh@example.com",
            "yt.hoa@example.com"
        ],
        "doctorName": "Bác sĩ G",
        "date": "2025-04-16",
        "time": "13:00"
    },
    {
        "id": 8,
        "type": "Lịch khám ngoại trú",
        "department": "ngoai",
        "eventName": "Sự kiện 8",
        "location": "Phòng 101",
        "startDateTime": "2025-04-18T14:00:00",
        "endDateTime": "2025-04-18T15:00:00",
        "note": "Ghi chú cho sự kiện 8",
        "repeatDays": [
            "friday"
        ],
        "repeatFrequency": 1,
        "members": [
            "bs.minh@example.com",
            "yt.hoa@example.com"
        ],
        "doctorName": "Bác sĩ H",
        "date": "2025-04-18",
        "time": "14:00"
    },
    {
        "id": 9,
        "type": "Lịch khác",
        "department": "noi",
        "eventName": "Sự kiện 9",
        "location": "Phòng mổ 2",
        "startDateTime": "2025-04-20T16:00:00",
        "endDateTime": "2025-04-20T17:00:00",
        "note": "Ghi chú cho sự kiện 9",
        "repeatDays": [
            "friday"
        ],
        "repeatFrequency": 3,
        "members": [
            "bs.minh@example.com",
            "yt.hoa@example.com"
        ],
        "doctorName": "Bác sĩ I",
        "date": "2025-04-20",
        "time": "16:00"
    },
    {
        "id": 10,
        "type": "Lịch mổ",
        "department": "ngoai",
        "eventName": "Sự kiện 10",
        "location": "Phòng 202",
        "startDateTime": "2025-04-18T16:00:00",
        "endDateTime": "2025-04-18T17:00:00",
        "note": "Ghi chú cho sự kiện 10",
        "repeatDays": [
            "tuesday",
            "thursday"
        ],
        "repeatFrequency": 3,
        "members": [],
        "doctorName": "Bác sĩ J",
    },
    {
        "id": 11,
        "type": "Lịch họp",
        "department": "noi",
        "eventName": "Sự kiện 11",
        "location": "Phòng 101",
        "startDateTime": "2025-04-20T14:00:00",
        "endDateTime": "2025-04-20T15:00:00",
        "note": "Ghi chú cho sự kiện 11",
        "repeatDays": [
            "saturday",
            "sunday"
        ],
        "repeatFrequency": 2,
        "members": [],
        "doctorName": "Bác sĩ K",
        "date": "2025-04-20",
        "time": "14:00"
    },
    {
        "id": 12,
        "type": "Lịch khác",
        "department": "ngoai",
        "eventName": "Sự kiện 12",
        "location": "Phòng hội thảo",
        "startDateTime": "2025-04-14T13:00:00",
        "endDateTime": "2025-04-14T14:00:00",
        "note": "Ghi chú cho sự kiện 12",
        "repeatDays": [
            "monday",
            "wednesday"
        ],
        "repeatFrequency": 1,
        "members": [
            "bs.an@example.com"
        ],
        "doctorName": "Bác sĩ L",
        "date": "2025-04-14",
        "time": "13:00"
    },
    {
        "id": 13,
        "type": "Lịch mổ",
        "department": "ngoai",
        "eventName": "Sự kiện 13",
        "location": "Phòng mổ 2",
        "startDateTime": "2025-04-17T12:00:00",
        "endDateTime": "2025-04-17T13:00:00",
        "note": "Ghi chú cho sự kiện 13",
        "repeatDays": [
            "friday"
        ],
        "repeatFrequency": 3,
        "members": [],
        "doctorName": "Bác sĩ M",
        "date": "2025-04-17",
        "time": "12:00"
    },
    {
        "id": 14,
        "type": "Lịch trực",
        "department": "ngoai",
        "eventName": "Sự kiện 14",
        "location": "Phòng mổ 1",
        "startDateTime": "2025-04-16T16:00:00",
        "endDateTime": "2025-04-16T17:00:00",
        "note": "Ghi chú cho sự kiện 14",
        "repeatDays": [
            "friday"
        ],
        "repeatFrequency": 2,
        "members": [
            "bs.minh@example.com",
            "yt.hoa@example.com"
        ],
        "doctorName": "Bác sĩ N",
        "date": "2025-04-16",
        "time": "16:00"
    },
    {
        "id": 15,
        "type": "Lịch khác",
        "department": "ngoai",
        "eventName": "Sự kiện 15",
        "location": "Phòng mổ 2",
        "startDateTime": "2025-04-15T11:00:00",
        "endDateTime": "2025-04-15T12:00:00",
        "note": "Ghi chú cho sự kiện 15",
        "repeatDays": [
            "friday"
        ],
        "repeatFrequency": 1,
        "members": [
            "bs.an@example.com"
        ],
        "doctorName": "Bác sĩ B",
        "date": "2025-04-15",
        "time": "11:00"
    }
]

export default fakeScheduleData;
