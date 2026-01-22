# Guía para Generar PDF del Informe de Auditoría

## Opción 1: Usar el HTML Generado (Recomendado)

1. Abre el archivo `AUDIT_REPORT.html` en tu navegador
2. Presiona `Ctrl+P` (o `Cmd+P` en Mac)
3. Selecciona "Guardar como PDF" como destino
4. Ajusta márgenes y configuración según necesites
5. Guarda el PDF

**Ventajas:**
- No requiere instalación de dependencias
- Control total sobre formato y páginas
- Compatible con cualquier navegador

---

## Opción 2: Usar markdown-pdf (Node.js)

### Instalación

```bash
npm install -g markdown-pdf
```

### Generar PDF

```bash
cd c:\Users\lalla\legal-py
markdown-pdf AUDIT_REPORT_FINAL.md -o AUDIT_REPORT.pdf
```

**Opciones adicionales:**

```bash
# Con CSS personalizado
markdown-pdf AUDIT_REPORT_FINAL.md -o AUDIT_REPORT.pdf -s custom.css

# Con configuración de página
markdown-pdf AUDIT_REPORT_FINAL.md -o AUDIT_REPORT.pdf --paper-format A4 --paper-orientation portrait
```

---

## Opción 3: Usar Pandoc (Multiplataforma)

### Instalación

Descarga desde: https://pandoc.org/installing.html

### Generar PDF

```bash
pandoc AUDIT_REPORT_FINAL.md -o AUDIT_REPORT.pdf --pdf-engine=xelatex -V geometry:margin=2cm
```

**Con template personalizado:**

```bash
pandoc AUDIT_REPORT_FINAL.md -o AUDIT_REPORT.pdf --template=eisvogel --pdf-engine=xelatex
```

---

## Opción 4: Usar VS Code Extension

1. Instala la extensión "Markdown PDF" en VS Code
2. Abre `AUDIT_REPORT_FINAL.md`
3. Presiona `Ctrl+Shift+P` (o `Cmd+Shift+P`)
4. Selecciona "Markdown PDF: Export (pdf)"
5. El PDF se generará en la misma carpeta

---

## Opción 5: Usar Online Converters

1. Sube `AUDIT_REPORT_FINAL.md` a:
   - https://www.markdowntopdf.com/
   - https://dillinger.io/ (exportar como PDF)
   - https://stackedit.io/ (exportar como PDF)

**Nota:** Asegúrate de que no contenga información sensible antes de subir.

---

## Recomendación

**Para uso inmediato:** Opción 1 (HTML + navegador)  
**Para automatización:** Opción 2 (markdown-pdf)  
**Para mejor calidad tipográfica:** Opción 3 (Pandoc)

---

## Archivos Disponibles

- `AUDIT_REPORT.md` - Versión original del informe
- `AUDIT_REPORT_FINAL.md` - Versión final con fixes aplicados
- `AUDIT_REPORT.html` - HTML generado automáticamente (listo para PDF)
