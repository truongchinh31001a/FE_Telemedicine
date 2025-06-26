'use client';

import {
  Card,
  Descriptions,
  Table,
  Typography,
  Upload,
  Button,
  Spin,
} from 'antd';
import {
  UserOutlined,
  PaperClipOutlined,
  PhoneOutlined,
  CreditCardOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

const { Title } = Typography;

const attachmentProps = {
  beforeUpload: () => false,
  multiple: true,
};

const getAuthTokenFromCookie = () => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/token=([^;]+)/);
  return match?.[1] ?? null;
};

const convertPatientToGeneralInfo = (raw) => {
  return {
    fullName: raw.FullName,
    patientCode: `BN${String(raw.PatientID).padStart(3, '0')}`,
    socialInsurance: '',
    membershipType: '',
    phone: raw.Phone,
    email: '',
    cccd: raw.CCCD,
    birthDate: raw.DateOfBirth ? dayjs(raw.DateOfBirth).format('DD/MM/YYYY') : '',
    gender: raw.Gender,
    ethnicity: raw.Ethnicity,
    nationality: raw.Nationality,
    address: raw.Address,
    occupation: raw.PatientJob,
    contacts: raw.RelativeName
      ? [
        {
          index: 1,
          patientCode: `BN${String(raw.PatientID).padStart(3, '0')}`,
          fullName: raw.RelativeName,
          relation: raw.Relationship,
          cccd: '',
          phone: raw.RelativePhone,
        },
      ]
      : [],
    insurances: [],
  };
};

export default function GeneralInfoTab({ patientId }) {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!patientId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/proxy/patients/${patientId}`, {
          method: 'GET',
          credentials: 'include', // gửi cookie
        });

        if (!res.ok) throw new Error(`❌ HTTP ${res.status}`);

        const raw = await res.json();
        const converted = convertPatientToGeneralInfo(raw);
        setData(converted);
      } catch (err) {
        console.error('❌ Lỗi khi fetch general info:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [patientId]);

  const contactColumns = [
    { title: t('general_info.contact.index'), dataIndex: 'index', key: 'index', width: 50 },
    { title: t('general_info.contact.patient_code'), dataIndex: 'patientCode', key: 'patientCode' },
    { title: t('general_info.contact.full_name'), dataIndex: 'fullName', key: 'fullName' },
    { title: t('general_info.contact.relation'), dataIndex: 'relation', key: 'relation' },
    { title: t('general_info.contact.cccd'), dataIndex: 'cccd', key: 'cccd' },
    { title: t('general_info.contact.phone'), dataIndex: 'phone', key: 'phone' },
  ];

  const insuranceColumns = [
    { title: t('general_info.insurance.index'), dataIndex: 'index', key: 'index', width: 50 },
    { title: t('general_info.insurance.type'), dataIndex: 'type', key: 'type' },
    { title: t('general_info.insurance.number'), dataIndex: 'number', key: 'number' },
    { title: t('general_info.insurance.start_date'), dataIndex: 'startDate', key: 'startDate' },
    { title: t('general_info.insurance.end_date'), dataIndex: 'endDate', key: 'endDate' },
    { title: t('general_info.insurance.registered_place'), dataIndex: 'registeredPlace', key: 'registeredPlace' },
  ];

  if (loading) return <Spin />;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <Card
        title={
          <span>
            <UserOutlined className="mr-2" />
            {t('general_info.title')}
          </span>
        }
      >
        <Descriptions column={2} bordered size="small">
          <Descriptions.Item label={t('general_info.full_name')}>{data.fullName}</Descriptions.Item>
          <Descriptions.Item label={t('general_info.patient_code')}>{data.patientCode}</Descriptions.Item>
          <Descriptions.Item label={t('general_info.social_insurance')}>{data.socialInsurance}</Descriptions.Item>
          <Descriptions.Item label={t('general_info.membership_type')}>{data.membershipType}</Descriptions.Item>
          <Descriptions.Item label={t('general_info.phone')}>{data.phone}</Descriptions.Item>
          <Descriptions.Item label={t('general_info.email')}>{data.email}</Descriptions.Item>
          <Descriptions.Item label={t('general_info.cccd')}>{data.cccd}</Descriptions.Item>
          <Descriptions.Item label={t('general_info.birth_date')}>{data.birthDate}</Descriptions.Item>
          <Descriptions.Item label={t('general_info.gender')}>{data.gender}</Descriptions.Item>
          <Descriptions.Item label={t('general_info.ethnicity')}>{data.ethnicity}</Descriptions.Item>
          <Descriptions.Item label={t('general_info.nationality')}>{data.nationality}</Descriptions.Item>
          <Descriptions.Item label={t('general_info.address')}>{data.address}</Descriptions.Item>
          <Descriptions.Item label={t('general_info.occupation')} span={2}>{data.occupation}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card
        title={
          <span>
            <PaperClipOutlined className="mr-2" />
            {t('general_info.upload_title')}
          </span>
        }
      >
        <Upload {...attachmentProps}>
          <Button icon={<PaperClipOutlined />}>{t('general_info.upload_button')}</Button>
        </Upload>
      </Card>

      <Card
        title={
          <span>
            <PhoneOutlined className="mr-2" />
            {t('general_info.contact_title')}
          </span>
        }
      >
        <Table
          dataSource={data.contacts}
          columns={contactColumns}
          pagination={false}
          rowKey="index"
        />
      </Card>

      <Card
        title={
          <span>
            <CreditCardOutlined className="mr-2" />
            {t('general_info.insurance_title')}
          </span>
        }
      >
        <Table
          dataSource={data.insurances}
          columns={insuranceColumns}
          pagination={false}
          rowKey="index"
        />
      </Card>
    </div>
  );
}
