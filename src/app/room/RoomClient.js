'use client';

import '@livekit/components-styles';
import {
  LiveKitRoom,
  RoomAudioRenderer,
} from '@livekit/components-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import jwt from 'jsonwebtoken';

import JoinForm from '@/components/room/JoinForm';
import MyVideoConference from '@/components/room/MyVideoConference';
import { fetchLiveKitToken } from '@/utils/livekit';
import CustomControlBar from '@/components/room/CustomControlBar';

export default function RoomClient() {
  const searchParams = useSearchParams();
  const [room, setRoom] = useState('');
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [patientId, setPatientId] = useState(null);
  const [recordId, setRecordId] = useState(null);
  const [appointmentId, setAppointmentId] = useState(null);

  useEffect(() => {
    const encoded = searchParams.get('data');

    if (encoded) {
      try {
        const decoded = jwt.decode(encoded);
        if (!decoded || typeof decoded !== 'object') throw new Error('Invalid token');

        setRoom(decoded.room);
        setName(decoded.name);
        setPatientId(decoded.patientId ?? null);
        setRecordId(decoded.recordId ?? null);
        setAppointmentId(decoded.appointmentId ?? null);

      } catch (err) {
        console.error('❌ Lỗi khi decode JWT:', err);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (!room || !name || token) return;
    fetchLiveKitToken(room, name)
      .then(setToken)
      .catch((err) => console.error('❌ Failed to fetch token:', err));
  }, [room, name, token]);

  if (!token && (!room || !name)) {
    return (
      <JoinForm
        room={room}
        name={name}
        setRoom={setRoom}
        setName={setName}
        setToken={setToken}
      />
    );
  }

  return (
    <LiveKitRoom
      video
      audio
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      onDisconnected={() => {
        window.close();
        setTimeout(() => {
          if (!window.closed) {
            window.location.href = '/';
          }
        }, 300);
      }}
      data-lk-theme="default"
      style={{ height: '100dvh' }}
    >
      <MyVideoConference />
      <RoomAudioRenderer />
      <CustomControlBar patientId={patientId} recordId={recordId} appointmentId={appointmentId} />
    </LiveKitRoom>
  );
}
