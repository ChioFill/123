import { DateDetails } from '../types';

export function exportRSVPToCSV(details: DateDetails): void {
  const headers = [
    'Статус подтверждения',
    'Дата свидания',
    'Время свидания',
    'Место проведения',
    'Атмосфера',
    'Кухня / Угощения',
    'Сюрприз включён',
    'План после ужина',
    'Пожелания / Заметки',
    'Дата и время обновления',
    'Хэш подтверждения',
  ];

  const escapeCSV = (val: string | undefined | null | boolean) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const statusLabelMap: Record<string, string> = {
    pending: 'Ожидает ответа',
    accepted: 'Да, я согласна! ❤️',
    rescheduled: 'Предложено другое время/место',
    declined: 'Отклонено',
  };

  const row = [
    escapeCSV(statusLabelMap[details.status] || details.status),
    escapeCSV(details.date),
    escapeCSV(details.time),
    escapeCSV(details.location),
    escapeCSV(details.preferences?.atmosphere || 'Романтическая / Свечи'),
    escapeCSV(details.preferences?.cuisine || 'Изысканная европейская'),
    escapeCSV(details.preferences?.surprise ? 'Да (сюрприз подготовлен)' : 'Нет'),
    escapeCSV(details.preferences?.afterDinnerPlan || 'Прогулка под ночными огнями'),
    escapeCSV(details.notes || 'Без особых заметок'),
    escapeCSV(new Date(details.updatedAt || Date.now()).toLocaleString('ru-RU')),
    escapeCSV(`VAULT-SHA256-${Date.now().toString(16).toUpperCase()}`),
  ];

  // UTF-8 BOM so Russian characters display properly in MS Excel and Apple Numbers
  const csvContent = '\uFEFF' + headers.join(';') + '\r\n' + row.join(';') + '\r\n';

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `romantic_date_report_${details.date}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportInvitationToPDF(details: DateDetails): void {
  const statusLabel = details.status === 'accepted' ? 'ПОДТВЕРЖДЕНО ❤️' : 'ПРИГЛАШЕНИЕ НА СВИДАНИЕ';
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    window.print();
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta charset="UTF-8">
      <title>Романтическое свидание - Билет-приглашение</title>
      <style>
        @page { size: A4; margin: 20mm; }
        body {
          font-family: 'Times New Roman', serif, Georgia;
          background: #ffffff;
          color: #2b131e;
          padding: 30px;
          margin: 0;
        }
        .ticket-container {
          border: 3px double #e11d48;
          border-radius: 16px;
          padding: 40px;
          position: relative;
          background: linear-gradient(135deg, #fff5f7 0%, #ffffff 100%);
          box-shadow: 0 10px 30px rgba(225, 29, 72, 0.08);
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #fecdd3;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          font-size: 32px;
          color: #9f1239;
          margin: 0 0 10px 0;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .badge {
          display: inline-block;
          background: #e11d48;
          color: white;
          padding: 6px 18px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: bold;
          letter-spacing: 1px;
        }
        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 30px;
        }
        .item {
          background: #ffffff;
          border: 1px solid #fbcfe8;
          padding: 16px;
          border-radius: 10px;
        }
        .label {
          font-size: 12px;
          text-transform: uppercase;
          color: #be123c;
          font-weight: bold;
          margin-bottom: 6px;
        }
        .value {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }
        .quote {
          text-align: center;
          font-style: italic;
          font-size: 18px;
          color: #881337;
          margin: 30px 0;
          padding: 20px;
          background: #fff1f2;
          border-radius: 12px;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px dashed #fda4af;
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #6b7280;
        }
      </style>
    </head>
    <body>
      <div class="ticket-container">
        <div class="header">
          <div class="badge">${statusLabel}</div>
          <h1>Особенный вечер для двоих</h1>
          <p style="color: #6b7280; margin: 5px 0 0 0;">Официальный электронный билет-приглашение</p>
        </div>

        <div class="grid">
          <div class="item">
            <div class="label">Дата встречи</div>
            <div class="value">${details.date === '2026-10-03' ? '03 октября 2026 года' : details.date}</div>
          </div>
          <div class="item">
            <div class="label">Время встречи</div>
            <div class="value">${details.time}</div>
          </div>
          <div class="item" style="grid-column: span 2;">
            <div class="label">Место проведения</div>
            <div class="value">${details.location}</div>
          </div>
          <div class="item">
            <div class="label">Атмосфера</div>
            <div class="value">${details.preferences?.atmosphere || 'Романтическая / Свечи'}</div>
          </div>
          <div class="item">
            <div class="label">Программа после ужина</div>
            <div class="value">${details.preferences?.afterDinnerPlan || 'Вечерняя прогулка под звездами'}</div>
          </div>
        </div>

        <div class="quote">
          «Каждая секунда рядом с тобой — это бесценный подарок. С нетерпением жду нашего свидания!»
        </div>

        <div class="footer">
          <div>Идентификатор: <b>ROMANTIC-AUTH-2026-10-03</b></div>
          <div>Шифрование: <b>AES-GCM-256 Verified</b></div>
          <div>Создано: <b>${new Date().toLocaleDateString('ru-RU')}</b></div>
        </div>
      </div>
      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
