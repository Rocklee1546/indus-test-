// Utility functions for exporting CRM data to CSV, genuine Excel (.xlsx), and PDF (.pdf)
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}

export function exportToCSV(headers, rows, filename) {
  const headerLine = headers.map(h => `"${(h.label || '').replace(/"/g, '""')}"`).join(',');
  const rowLines = rows.map(row =>
    headers.map(h => {
      const val = row[h.key] ?? '';
      return `"${String(val).replace(/"/g, '""')}"`;
    }).join(',')
  );

  const csvContent = [headerLine, ...rowLines].join('\r\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const finalFilename = filename.toLowerCase().endsWith('.csv') ? filename : `${filename}.csv`;
  downloadBlob(blob, finalFilename);
}

export function exportToExcel(headers, rows, filename, sheetName = 'Sheet1') {
  // Genuine XLSX workbook using SheetJS
  const formattedData = rows.map(row => {
    const obj = {};
    headers.forEach(h => {
      obj[h.label] = row[h.key] ?? '';
    });
    return obj;
  });

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.substring(0, 31));

  // Auto-calculate column widths
  const colWidths = headers.map(h => {
    const headerLen = (h.label || '').length;
    let maxContentLen = 0;
    for (let i = 0; i < Math.min(rows.length, 50); i++) {
      const len = String(rows[i][h.key] ?? '').length;
      if (len > maxContentLen) maxContentLen = len;
    }
    return { wch: Math.min(Math.max(headerLen, maxContentLen) + 3, 40) };
  });
  worksheet['!cols'] = colWidths;

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  const finalFilename = filename.toLowerCase().endsWith('.xlsx')
    ? filename
    : `${filename.replace(/\.[^/.]+$/, '')}.xlsx`;
  downloadBlob(blob, finalFilename);
}

export function exportToPDF(headers, rows, filename, title = 'INDUS Dental Report') {
  const isLandscape = headers.length > 5;
  const doc = new jsPDF({
    orientation: isLandscape ? 'landscape' : 'portrait',
    unit: 'pt',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Top Accent Bar
  doc.setFillColor(23, 105, 210); // #1769D2
  doc.rect(0, 0, pageWidth, 6, 'F');

  // Clinic Branding
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(16, 42, 80); // #102A50
  doc.text('INDUS Dental – Multi-Speciality Dental Hospital', 28, 28);

  // Report Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(23, 105, 210);
  doc.text(title, 28, 44);

  // Timestamp
  const now = new Date();
  const dateStr = `Exported: ${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} | Records: ${rows.length}`;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(dateStr, pageWidth - 28, 44, { align: 'right' });

  // Table Data
  const tableHead = [headers.map(h => h.label)];
  const tableBody = rows.map(row => headers.map(h => String(row[h.key] ?? '—')));

  autoTable(doc, {
    head: tableHead,
    body: tableBody,
    startY: 56,
    margin: { left: 24, right: 24, top: 40, bottom: 36 },
    theme: 'grid',
    headStyles: {
      fillColor: [16, 42, 80],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      cellPadding: 5
    },
    styles: {
      font: 'helvetica',
      fontSize: 8,
      cellPadding: 4,
      overflow: 'linebreak',
      textColor: [30, 41, 59]
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    didDrawPage: (data) => {
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `INDUS Dental CRM • Page ${data.pageNumber} of ${pageCount}`,
        pageWidth / 2,
        pageHeight - 14,
        { align: 'center' }
      );
    }
  });

  const finalFilename = filename.toLowerCase().endsWith('.pdf')
    ? filename
    : `${filename.replace(/\.[^/.]+$/, '')}.pdf`;
  doc.save(finalFilename);
}
