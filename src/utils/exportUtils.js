// Utility functions for exporting CRM data to CSV and Excel (.xlsx)

function escapeXml(unsafe) {
  if (unsafe === null || unsafe === undefined) return '';
  return String(unsafe).replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

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

export function exportToExcel(headers, rows, filename) {
  // XML Spreadsheet 2003 format - natively supported by Excel and openable as .xlsx/.xls
  const headerCells = headers
    .map(h => `<Cell ss:StyleID="Header"><Data ss:Type="String">${escapeXml(h.label)}</Data></Cell>`)
    .join('');

  const rowNodes = rows
    .map(row => {
      const cells = headers
        .map(h => {
          const val = row[h.key] ?? '';
          return `<Cell><Data ss:Type="String">${escapeXml(String(val))}</Data></Cell>`;
        })
        .join('');
      return `<Row>${cells}</Row>`;
    })
    .join('\n');

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Header">
   <Font ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#1769D2" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Sheet1">
  <Table>
   <Row ss:Height="24">
    ${headerCells}
   </Row>
   ${rowNodes}
  </Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([xmlContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const finalFilename = filename.toLowerCase().endsWith('.xlsx')
    ? filename
    : filename.toLowerCase().endsWith('.xls')
    ? filename
    : `${filename}.xlsx`;
  downloadBlob(blob, finalFilename);
}
