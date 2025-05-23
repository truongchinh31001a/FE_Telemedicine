import { Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import { useEffect, useState, useMemo } from 'react';

import GeneralInfoTab from './tabs/GeneralInfoTab';
import MedicalHistoryTab from './tabs/MedicalHistoryTab';
import ExaminationTab from './tabs/ExaminationTab/ExaminationTab';
import PrescriptionTab from './tabs/PrescriptionTab';
import LabTestTab from './tabs/LabTestTab';
import ImagingTab from './tabs/ImagingTab';

const MedicalRecordTab = ({ record }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('general');

  // Reset tab khi đổi hồ sơ
  useEffect(() => {
    setActiveTab('general');
  }, [record?.id]);

  const renderTabContent = useMemo(() => {
    switch (activeTab) {
      case 'general':
        return <GeneralInfoTab patientId={record?.id} />;
      case 'history':
        return <MedicalHistoryTab patientId={record?.id} />;
      case 'examination':
        return <ExaminationTab patientId={record?.id} />;
      // case 'prescription':
      //   return <PrescriptionTab patientId={record?.id} />;
      // case 'lab':
      //   return <LabTestTab patientId={record?.id} />;
      // case 'imaging':
      //   return <ImagingTab patientId={record?.id} />;
      default:
        return null;
    }
  }, [activeTab, record?.id]);

  const tabLabels = [
    { key: 'general', label: t('medical_record_tab.general_info') },
    { key: 'history', label: t('medical_record_tab.medical_history') },
    { key: 'examination', label: t('medical_record_tab.examination') },
    // { key: 'prescription', label: t('medical_record_tab.prescription') },
    // { key: 'lab', label: t('medical_record_tab.lab_test') },
    // { key: 'imaging', label: t('medical_record_tab.imaging') },
  ];

  return (
    <div className="bg-white p-4 rounded-md overflow-x-auto">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabLabels.map(({ key, label }) => ({
          key,
          label,
          children: key === activeTab ? renderTabContent : null, // chỉ render tab đang mở
        }))}
        tabPosition="top"
        type="line"
      />
    </div>
  );
};

export default MedicalRecordTab;
