# Instrucciones para Generar PDF del Informe

## Opción 1: Usando Pandoc (Recomendado)

```bash
# Instalar Pandoc (si no está instalado)
# Windows: choco install pandoc
# O descargar desde: https://pandoc.org/installing.html

# Generar PDF
pandoc docs/INFORME_EJECUTIVO_LEGAL_PY_2026.md -o docs/INFORME_EJECUTIVO_LEGAL_PY_2026.pdf --pdf-engine=xelatex -V geometry:margin=1in
```

## Opción 2: Usando Markdown a PDF Online

1. Abre el archivo `docs/INFORME_EJECUTIVO_LEGAL_PY_2026.md`
2. Copia todo el contenido
3. Ve a: https://www.markdowntopdf.com/
4. Pega el contenido y genera el PDF

## Opción 3: Usando VS Code

1. Instala la extensión "Markdown PDF" en VS Code
2. Abre el archivo `.md`
3. Click derecho → "Markdown PDF: Export (pdf)"

## Opción 4: Usando Node.js (md-to-pdf)

```bash
npm install -g md-to-pdf
md-to-pdf docs/INFORME_EJECUTIVO_LEGAL_PY_2026.md
```
