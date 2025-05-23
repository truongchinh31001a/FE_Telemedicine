// components/room/PatientMedicalRecordModal.js
'use client';

import { Modal } from 'antd';
import { useState } from 'react';
import ExaminationTab from '../layout/medicalRecord/tabs/ExaminationTab/ExaminationTab';

export default function PatientMedicalRecordModal({ open, onClose, patientId }) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width="90vw"
      style={{ top: 40 }}
      styles={{
        body: {
          maxHeight: '80vh',
          overflowY: 'auto',
        },
      }}
    >
      <ExaminationTab patientId={patientId} />
    </Modal>
  );
}
