/**
 * Script para generar PDF del informe de auditoría
 * Requiere: npm install -g markdown-pdf
 * O usar: npx markdown-pdf AUDIT_REPORT.md -o AUDIT_REPORT.pdf
 */

const fs = require('fs');
const path = require('path');

// Leer el markdown
const reportPath = path.join(__dirname, '..', 'AUDIT_REPORT.md');
const reportContent = fs.readFileSync(reportPath, 'utf-8');

// Crear HTML bien formateado para PDF
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
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 210mm;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      color: #0E1B2A;
      border-bottom: 3px solid #C9A24D;
      padding-bottom: 10px;
      margin-top: 30px;
    }
    h2 {
      color: #13253A;
      border-bottom: 2px solid #C9A24D;
      padding-bottom: 5px;
      margin-top: 25px;
    }
    h3 {
      color: #13253A;
      margin-top: 20px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
      font-size: 0.9em;
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
    }
    .status-ok { color: #10b981; font-weight: bold; }
    .status-partial { color: #f59e0b; font-weight: bold; }
    .status-fail { color: #ef4444; font-weight: bold; }
    .risk-critical { background-color: #fee2e2; padding: 2px 6px; border-radius: 3px; }
    .risk-high { background-color: #fef3c7; padding: 2px 6px; border-radius: 3px; }
    .risk-medium { background-color: #dbeafe; padding: 2px 6px; border-radius: 3px; }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #C9A24D;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
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
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Informe de Auditoría Integral</h1>
    <h2>Legal PY</h2>
    <p><strong>Fecha:</strong> Enero 2026</p>
    <p><strong>Alcance:</strong> Código fuente vs. Manual de Uso, Política de Seguridad, Material inversores y demo comercial</p>
    <p><strong>Equipo:</strong> Auditoría Bancaria/Fintech, LegalTech, QA, Security, Customer Journey</p>
  </div>

${convertMarkdownToHTML(reportContent)}

  <div class="footer">
    <p><strong>Legal PY</strong> - Informe de Auditoría Integral</p>
    <p>Generado: ${new Date().toLocaleString('es-PY', { dateStyle: 'long', timeStyle: 'short' })}</p>
    <p>Confidencial - Solo para uso interno y presentaciones autorizadas</p>
  </div>
</body>
</html>`;

function convertMarkdownToHTML(markdown) {
  let html = markdown;
  
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Code blocks
  html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Tables
  html = html.replace(/\|(.+)\|/g, (match, content) => {
    const cells = content.split('|').map(cell => cell.trim());
    if (cells[0].includes('---')) return '<hr>';
    return '<tr>' + cells.map(cell => `<td>${cell}</td>`).join('') + '</tr>';
  });
  
  // Lists
  html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  
  // Status indicators
  html = html.replace(/✅/g, '<span class="status-ok">✅</span>');
  html = html.replace(/⚠️/g, '<span class="status-partial">⚠️</span>');
  html = html.replace(/❌/g, '<span class="status-fail">❌</span>');
  
  // Risk levels
  html = html.replace(/\*\*Crítico\*\*/g, '<span class="risk-critical">Crítico</span>');
  html = html.replace(/\*\*Alto\*\*/g, '<span class="risk-high">Alto</span>');
  html = html.replace(/\*\*Medio\*\*/g, '<span class="risk-medium">Medio</span>');
  
  // Line breaks
  html = html.replace(/\n\n/g, '</p><p>');
  html = html.replace(/\n/g, '<br>');
  
  // Wrap paragraphs
  html = '<p>' + html + '</p>';
  
  return html;
}

// Guardar HTML
const htmlPath = path.join(__dirname, '..', 'AUDIT_REPORT.html');
fs.writeFileSync(htmlPath, htmlContent, 'utf-8');

console.log('✅ HTML generado en:', htmlPath);
console.log('📄 Abre el archivo en tu navegador y usa "Imprimir > Guardar como PDF"');
console.log('');
console.log('O usa markdown-pdf:');
console.log('  npm install -g markdown-pdf');
console.log('  markdown-pdf AUDIT_REPORT.md -o AUDIT_REPORT.pdf');
