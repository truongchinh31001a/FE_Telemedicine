const fakeDepartmentData = [
  {
    "DepartmentID": 1,
    "DepartmentName": "Khoa Nội",
    "DepartmentCode": "KN001",
    "Room": "P101",
    "Type": "Lâm sàng",
    "Phone": "02812345678",
    "Email": "khoanoi@hospital.vn",
    "Status": "Hoạt động",
    "avatar": "/images/departments/khoanoi.png",
    "Description": "Khoa Nội chuyên điều trị các bệnh lý nội khoa như tim mạch, hô hấp, tiêu hóa,...",
    "Services": "Khám nội tổng quát, điều trị nội trú, theo dõi huyết áp, tiểu đường,...",
    "Functions": "Tiếp nhận, chẩn đoán, điều trị và theo dõi bệnh nhân nội khoa.",
    "OtherInfo": "Hợp tác chuyên môn với Khoa Hồi sức và Khoa Tim mạch.",
    "Attachments": "",
    "members": [
      {
        "id": 1,
        "name": "BS. Nguyễn Văn A",
        "role": "Trưởng khoa",
        "avatar": "/avatars/a.jpg"
      },
      {
        "id": 2,
        "name": "BS. Trần Thị B",
        "role": "Bác sĩ điều trị",
        "avatar": "/avatars/b.jpg"
      }
    ],
    "relatedDepartments": [
      {
        "code": "KH001",
        "name": "Khoa Hồi sức"
      },
      {
        "code": "KT001",
        "name": "Khoa Tim mạch"
      }
    ]
  },
  {
    "DepartmentID": 2,
    "DepartmentName": "Khoa Ngoại",
    "DepartmentCode": "KN002",
    "Room": "P102",
    "Type": "Ngoại trú",
    "Phone": "02898765432",
    "Email": "khoangoai@hospital.vn",
    "Status": "Hoạt động",
    "avatar": "/images/departments/khoangoai.png",
    "Description": "Chuyên phẫu thuật và điều trị ngoại khoa.",
    "Services": "Phẫu thuật tiêu hóa, chỉnh hình, tiết niệu,...",
    "Functions": "Tiếp nhận, mổ cấp cứu, mổ chương trình cho bệnh nhân ngoại khoa.",
    "OtherInfo": "",
    "Attachments": "",
    "members": [
      {
        "id": 3,
        "name": "BS. Lê Văn C",
        "role": "Phó khoa",
        "avatar": "/avatars/c.jpg"
      }
    ],
    "relatedDepartments": [
      {
        "code": "KC001",
        "name": "Khoa Chẩn đoán hình ảnh"
      }
    ]
  }
]
export default fakeDepartmentData;