import { Suspense } from 'react';
import RoomClient from './RoomClient';

export default function RoomPage() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <RoomClient />
    </Suspense>
  );
}
