'use client';

import { useSyncExternalStore } from 'react';

// The date never needs live updates, so there is nothing to subscribe to.
const subscribe = () => () => {};

function getToday() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function TodayDate() {
  // getToday runs in the browser; the server renders null (same as before).
  const today = useSyncExternalStore(subscribe, getToday, () => null);

  return <p className="text-sm text-blue-200">{today}</p>;
}