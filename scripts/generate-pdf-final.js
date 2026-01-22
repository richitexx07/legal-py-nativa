/**
 * Script mejorado para generar PDF del informe de auditoría
 * Convierte AUDIT_REPORT_FINAL.md a HTML bien formateado para PDF
 */

const fs = require('fs');
const path = require('path');

const reportPath = path.join(__dirname, '..', 'AUDIT_REPORT_FINAL.md');
const htmlPath = path.join(__dirname, '..', 'AUDIT_REPORT_PDF.html');

if (!fs.existsSync(reportPath)) {
  console.error('❌ No se encontró AUDIT_REPORT_FINAL.md');
  process.exit(1);
}

const markdown = fs.readFileSync(reportPath, 'utf-8');

// Función simple para convertir markdown a HTML
function markdownToHTML(md) {
  let html = md;
  
  // Headers
  html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Code inline
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Code blocks
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
  
  // Tables - procesar línea por línea
  const lines = html.split('\n');
  let inTable = false;
  let tableRows = [];
  let result = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.startsWith('|') && line.endsWith('|')) {
      if (!inTable) {
        inTable = true;
        tableRows = [];
      }
      tableRows.push(line);
    } else {
      if (inTable && tableRows.length > 0) {
        // Procesar tabla
        const tableHTML = processTable(tableRows);
        result.push(tableHTML);
        tableRows = [];
        inTable = false;
      }
      result.push(line);
    }
  }
  
  if (inTable && tableRows.length > 0) {
    result.push(processTable(tableRows));
  }
  
  html = result.join('\n');
  
  // Lists
  html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  
  // Horizontal rules
  html = html.replace(/^---$/gim, '<hr>');
  
  // Paragraphs (líneas que no son headers, lists, etc.)
  const paragraphs = html.split('\n');
  const processed = [];
  let currentPara = [];
  
  for (const line of paragraphs) {
    if (line.match(/^<[h|u|o|t|p|d|h]/) || line.trim() === '' || line.match(/^<li>/) || line.match(/^<hr>/)) {
      if (currentPara.length > 0) {
        processed.push('<p>' + currentPara.join(' ') + '</p>');
        currentPara = [];
      }
      processed.push(line);
    } else {
      currentPara.push(line);
    }
  }
  
  if (currentPara.length > 0) {
    processed.push('<p>' + currentPara.join(' ') + '</p>');
  }
  
  return processed.join('\n');
}

function processTable(rows) {
  if (rows.length < 2) return '';
  
  let html = '<table>\n<thead>\n';
  const headerRow = rows[0];
  const headerCells = headerRow.split('|').map(c => c.trim()).filter(c => c);
  html += '<tr>' + headerCells.map(c => `<th>${c}</th>`).join('') + '</tr>\n</thead>\n<tbody>\n';
  
  // Skip separator row
  for (let i = 2; i < rows.length; i++) {
    const cells = rows[i].split('|').map(c => c.trim()).filter(c => c);
    if (cells.length > 0) {
      html += '<tr>' + cells.map(c => `<td>${processCell(c)}</td>`).join('') + '</tr>\n';
    }
  }
  
  html += '</tbody>\n</table>';
  return html;
}

function processCell(cell) {
  // Procesar status indicators
  cell = cell.replace(/✅/g, '<span class="status-ok">✅</span>');
  cell = cell.replace(/⚠️/g, '<span class="status-partial">⚠️</span>');
  cell = cell.replace(/❌/g, '<span class="status-fail">❌</span>');
  cell = cell.replace(/\*\*Crítico\*\*/g, '<span class="risk-critical">Crítico</span>');
  cell = cell.replace(/\*\*Alto\*\*/g, '<span class="risk-high">Alto</span>');
  cell = cell.replace(/\*\*Medio\*\*/g, '<span class="risk-medium">Medio</span>');
  return cell;
}

const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Informe de Auditoría Integral - Legal PY</title>
  <style>
    @page {
      size: A4;
      margin: 2cm;
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 210mm;
      margin: 0 auto;
      padding: 20px;
      background: white;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 3px solid #C9A24D;
    }
    .header h1 {
      color: #0E1B2A;
      font-size: 28px;
      margin-bottom: 10px;
      border: none;
      padding: 0;
    }
    .header h2 {
      color: #13253A;
      font-size: 20px;
      margin-bottom: 15px;
      border: none;
      padding: 0;
    }
    .header p {
      color: #666;
      font-size: 14px;
      margin: 5px 0;
    }
    h1 {
      color: #0E1B2A;
      border-bottom: 3px solid #C9A24D;
      padding-bottom: 10px;
      margin-top: 30px;
      margin-bottom: 15px;
      font-size: 24px;
    }
    h2 {
      color: #13253A;
      border-bottom: 2px solid #C9A24D;
      padding-bottom: 5px;
      margin-top: 25px;
      margin-bottom: 12px;
      font-size: 20px;
    }
    h3 {
      color: #13253A;
      margin-top: 20px;
      margin-bottom: 10px;
      font-size: 18px;
    }
    h4 {
      color: #13253A;
      margin-top: 15px;
      margin-bottom: 8px;
      font-size: 16px;
    }
    p {
      margin: 10px 0;
      text-align: justify;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
      font-size: 0.85em;
      page-break-inside: avoid;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    th {
      background-color: #0E1B2A;
      color: white;
      font-weight: bold;
    }
    tr:nth-child(even) {
      background-color: #f9f9f9;
    }
    code {
      background-color: #f4f4f4;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
      font-size: 0.9em;
    }
    pre {
      background-color: #f4f4f4;
      padding: 15px;
      border-radius: 5px;
      overflow-x: auto;
      border-left: 4px solid #C9A24D;
      margin: 15px 0;
      page-break-inside: avoid;
      font-size: 0.85em;
    }
    pre code {
      background: none;
      padding: 0;
    }
    .status-ok { color: #10b981; font-weight: bold; }
    .status-partial { color: #f59e0b; font-weight: bold; }
    .status-fail { color: #ef4444; font-weight: bold; }
    .risk-critical { background-color: #fee2e2; padding: 3px 8px; border-radius: 3px; font-weight: bold; }
    .risk-high { background-color: #fef3c7; padding: 3px 8px; border-radius: 3px; font-weight: bold; }
    .risk-medium { background-color: #dbeafe; padding: 3px 8px; border-radius: 3px; font-weight: bold; }
    .risk-low { background-color: #d1fae5; padding: 3px 8px; border-radius: 3px; font-weight: bold; }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #C9A24D;
      text-align: center;
      font-size: 0.9em;
      color: #666;
    }
    hr {
      border: none;
      border-top: 1px solid #ddd;
      margin: 20px 0;
    }
    ul, ol {
      margin: 10px 0;
      padding-left: 30px;
    }
    li {
      margin: 5px 0;
    }
    blockquote {
      border-left: 4px solid #C9A24D;
      padding-left: 15px;
      margin: 15px 0;
      font-style: italic;
      color: #555;
      background-color: #f9f9f9;
      padding: 10px 15px;
    }
    .summary-box {
      background-color: #f0f9ff;
      border: 2px solid #C9A24D;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .summary-box h3 {
      color: #0E1B2A;
      margin-top: 0;
    }
    .fix-applied {
      background-color: #d1fae5;
      border-left: 4px solid #10b981;
      padding: 10px 15px;
      margin: 10px 0;
    }
    .fix-pending {
      background-color: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 10px 15px;
      margin: 10px 0;
    }
    .page-break {
      page-break-before: always;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Informe de Auditoría Integral</h1>
    <h2>Legal PY</h2>
    <p><strong>Fecha:</strong> Enero 2026</p>
    <p><strong>Versión del Informe:</strong> 1.0 Final</p>
    <p><strong>Alcance:</strong> Código fuente vs. Manual de Uso, Política de Seguridad, Material inversores y demo comercial</p>
    <p><strong>Equipo:</strong> Auditoría Bancaria/Fintech, LegalTech, QA, Security, Customer Journey</p>
  </div>

  ${markdownToHTML(markdown)}

  <div class="footer">
    <p><strong>Legal PY</strong> - Informe de Auditoría Integral</p>
    <p>Generado: ${new Date().toLocaleString('es-PY', { dateStyle: 'long', timeStyle: 'short' })}</p>
    <p>Confidencial - Solo para uso interno y presentaciones autorizadas</p>
    <p><strong>Versión del Informe:</strong> 1.0 Final</p>
  </div>
</body>
</html>`;

fs.writeFileSync(htmlPath, htmlContent, 'utf-8');

console.log('✅ HTML generado exitosamente en:', htmlPath);
console.log('');
console.log('📄 Para convertir a PDF:');
console.log('   1. Abre AUDIT_REPORT_PDF.html en tu navegador');
console.log('   2. Presiona Ctrl+P (o Cmd+P en Mac)');
console.log('   3. Selecciona "Guardar como PDF" como destino');
console.log('   4. Ajusta márgenes si es necesario');
console.log('   5. Guarda el PDF');
console.log('');
console.log('💡 Alternativa: Usa markdown-pdf');
console.log('   npm install -g markdown-pdf');
console.log('   markdown-pdf AUDIT_REPORT_FINAL.md -o AUDIT_REPORT.pdf');
