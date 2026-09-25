/**
 * Apple Calendar (.ics) and Google Calendar sync service
 * Implements RFC 5545 specifications with automatic reminders (VALARM).
 */

export interface CalendarEventParams {
  title: string;
  description: string;
  location: string;
  dateStr: string; // YYYY-MM-DD
  timeStr: string; // HH:mm
  durationHours?: number;
}

function formatDateToICS(d: Date): string {
  const pad = (n: number) => (n < 10 ? '0' + n : n.toString());
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    'T' +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    'Z'
  );
}

export function generateICSContent(params: CalendarEventParams): string {
  const { title, description, location, dateStr, timeStr, durationHours = 3 } = params;

  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);

  const startDate = new Date(year, month - 1, day, hours, minutes);
  const endDate = new Date(startDate.getTime() + durationHours * 60 * 60 * 1000);

  const startFormatted = formatDateToICS(startDate);
  const endFormatted = formatDateToICS(endDate);
  const nowFormatted = formatDateToICS(new Date());

  const uid = `romantic-date-${startDate.getTime()}@ourlove.app`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Romantic Date Invitation//RU',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Наше особенное свидание ❤️',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${nowFormatted}`,
    `DTSTART:${startFormatted}`,
    `DTEND:${endFormatted}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    'DESCRIPTION:Напоминание: Завтра наше романтическое свидание ❤️',
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Напоминание: Через 2 часа долгожданная встреча ❤️',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export function downloadAppleCalendarICS(params: CalendarEventParams): void {
  const icsData = generateICSContent(params);
  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'Romantic_Date_Apple_Calendar.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export function getGoogleCalendarURL(params: CalendarEventParams): string {
  const { title, description, location, dateStr, timeStr, durationHours = 3 } = params;
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);

  const startDate = new Date(year, month - 1, day, hours, minutes);
  const endDate = new Date(startDate.getTime() + durationHours * 60 * 60 * 1000);

  const pad = (n: number) => (n < 10 ? '0' + n : n.toString());
  const formatGCal = (d: Date) =>
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

  const dates = `${formatGCal(startDate)}/${formatGCal(endDate)}`;
  const q = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates,
    details: description,
    location,
  });

  return `https://calendar.google.com/calendar/render?${q.toString()}`;
}
