'use client';
import { useState, useEffect } from 'react';

export default function TodayDate() {
  const [today, setToday] = useState<string | null>(null);

  useEffect(() => {
    setToday(
      new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    );
  }, []);

  return <p className="text-sm text-blue-200">{today}</p>;
}