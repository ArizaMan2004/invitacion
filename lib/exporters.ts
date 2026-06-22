// lib/exporters.ts
// Utilidad de exportación reutilizable. Las librerías (xlsx, docx) se cargan
// se cargan SOLO cuando se usan, mediante import dinámico => sin coste en la carga inicial.
//
// Requiere: npm install xlsx docx
// (CSV y PDF no requieren dependencias: el PDF usa el motor de impresión del navegador)

export interface ExportColumn<T> {
  header: string;
  accessor: (row: T) => string | number | null | undefined;
}

// Dispara la descarga de un Blob en el navegador
function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Convierte filas + columnas en encabezados y matriz de strings
function toMatrix<T>(rows: T[], columns: ExportColumn<T>[]) {
  const head = columns.map((c) => c.header);
  const body = rows.map((r) =>
    columns.map((c) => {
      const v = c.accessor(r);
      return v === null || v === undefined ? '' : String(v);
    })
  );
  return { head, body };
}

// ---------- CSV (sin dependencias, compatible con Excel) ----------
export function exportCSV<T>(rows: T[], columns: ExportColumn<T>[], filename: string) {
  const { head, body } = toMatrix(rows, columns);
  const escape = (s: string) => `"${s.replace(/"/g, '""')}"`;
  const lines = [head, ...body].map((row) => row.map(escape).join(','));
  // BOM (\uFEFF) para que Excel respete los acentos
  const csv = '\uFEFF' + lines.join('\r\n');
  triggerDownload(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), `${filename}.csv`);
}

// ---------- Excel (.xlsx con SheetJS) ----------
export async function exportExcel<T>(
  rows: T[],
  columns: ExportColumn<T>[],
  filename: string,
  sheetName = 'Datos'
) {
  const XLSX = await import('xlsx');
  const { head, body } = toMatrix(rows, columns);
  const ws = XLSX.utils.aoa_to_sheet([head, ...body]);

  // Ancho automático de columnas
  ws['!cols'] = head.map((h, i) => {
    const maxBody = body.reduce((m, r) => Math.max(m, (r[i] || '').length), 0);
    return { wch: Math.min(Math.max(h.length, maxBody) + 2, 60) };
  });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

// ---------- PDF (impresión nativa del navegador, SIN dependencias) ----------
// Abre una ventana con el reporte ya maquetado y lanza el diálogo de impresión.
// El usuario elige "Guardar como PDF". Evita por completo el problema de jspdf/fflate
// con Turbopack y produce un PDF más limpio y con acentos correctos.
export function exportPDF<T>(rows: T[], columns: ExportColumn<T>[], filename: string, title: string) {
  const { head, body } = toMatrix(rows, columns);
  const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(filename)}</title>
<style>
  * { font-family: Arial, Helvetica, sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { padding: 28px; color: #1a1a1a; }
  h1 { font-size: 20px; margin: 0 0 4px; color: #b8860b; }
  .meta { color: #888; font-size: 12px; margin-bottom: 18px; }
  table { width: 100%; border-collapse: collapse; font-size: 11.5px; }
  thead { display: table-header-group; }
  th { background: #b8860b; color: #fff; text-align: left; padding: 8px 10px; }
  td { padding: 7px 10px; border-bottom: 1px solid #eee; vertical-align: top; word-break: break-word; }
  tr:nth-child(even) td { background: #f7f5ee; }
  @page { margin: 14mm; }
</style></head>
<body>
  <h1>${esc(title)}</h1>
  <div class="meta">Generado: ${esc(new Date().toLocaleString())} &middot; ${rows.length} registro(s)</div>
  <table>
    <thead><tr>${head.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead>
    <tbody>${body.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody>
  </table>
  <script>window.onload=function(){setTimeout(function(){window.print();},350);};</script>
</body></html>`;

  const w = window.open('', '_blank');
  if (!w) {
    alert('Permite las ventanas emergentes para generar el PDF.');
    return;
  }
  w.document.open();
  w.document.write(html);
  w.document.close();
}

// ---------- Word (.docx) ----------
export async function exportWord<T>(
  rows: T[],
  columns: ExportColumn<T>[],
  filename: string,
  title: string
) {
  const docx = await import('docx');
  const {
    Document,
    Packer,
    Table,
    TableRow,
    TableCell,
    Paragraph,
    TextRun,
    WidthType,
    HeadingLevel,
  } = docx;
  const { head, body } = toMatrix(rows, columns);

  const headerRow = new TableRow({
    tableHeader: true,
    children: head.map(
      (h) =>
        new TableCell({
          shading: { fill: 'B8860B' },
          children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, color: 'FFFFFF' })] })],
        })
    ),
  });

  const dataRows = body.map(
    (r) =>
      new TableRow({
        children: r.map((cell) => new TableCell({ children: [new Paragraph(cell)] })),
      })
  );

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({ text: title, heading: HeadingLevel.HEADING_1 }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Generado: ${new Date().toLocaleString()}  ·  ${rows.length} registro(s)`,
                italics: true,
                color: '888888',
              }),
            ],
            spacing: { after: 200 },
          }),
          new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [headerRow, ...dataRows] }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  triggerDownload(blob, `${filename}.docx`);
}

export type ExportFormat = 'excel' | 'pdf' | 'word' | 'csv';

export async function runExport<T>(
  format: ExportFormat,
  rows: T[],
  columns: ExportColumn<T>[],
  filename: string,
  title: string
) {
  switch (format) {
    case 'excel':
      return exportExcel(rows, columns, filename);
    case 'pdf':
      return exportPDF(rows, columns, filename, title);
    case 'word':
      return exportWord(rows, columns, filename, title);
    case 'csv':
      return exportCSV(rows, columns, filename);
  }
}
