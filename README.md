# Legal Py

Plataforma legal integral de Paraguay. Demo para inversores con funcionalidades de búsqueda de profesionales, gestión de casos, trámites migratorios y más.

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ 
- npm, yarn, pnpm o bun

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd legal-py

# Instalar dependencias
npm install
# o
yarn install
# o
pnpm install
```

### Ejecutar en desarrollo

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## 📁 Estructura del Proyecto

```
legal-py/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Página principal
│   ├── layout.tsx         # Layout raíz con i18n
│   ├── globals.css        # Estilos globales
│   ├── profesionales/     # Páginas de profesionales
│   │   └── [id]/         # Detalle de profesional
│   ├── gestores/          # Página de gestores
│   ├── oficiales-justicia/ # Página de oficiales de justicia
│   ├── casos/             # Dashboard y detalle de casos
│   │   └── [id]/         # Detalle de caso
│   ├── migraciones/       # Trámites migratorios
│   └── chat/              # Chat y mensajería
├── components/            # Componentes reutilizables
│   ├── NavbarTop.tsx     # Navegación superior
│   ├── BottomNav.tsx      # Navegación inferior (móvil)
│   ├── FloatingChatButton.tsx
│   ├── Card.tsx
│   ├── Button.tsx
│   ├── Badge.tsx
│   ├── SearchBar.tsx
│   ├── Tabs.tsx
│   ├── Timeline.tsx
│   ├── DocumentList.tsx
│   ├── Snackbar.tsx
│   ├── LanguageSelector.tsx
│   ├── I18nProvider.tsx
│   └── Footer.tsx
├── lib/                   # Utilidades y datos
│   ├── i18n.ts           # Sistema de internacionalización
│   └── mock-data.ts      # Datos mock tipados
├── public/                # Archivos estáticos
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

## 🌍 Internacionalización (i18n)

El proyecto incluye soporte para 4 idiomas:

- **Español (es)** - Idioma por defecto
- **Guaraní (gn)** - Idioma oficial de Paraguay
- **English (en)**
- **Português (pt)**

### Uso de i18n

```typescript
import { useI18n } from "@/components/I18nProvider";

function MyComponent() {
  const { t, idioma, setIdioma } = useI18n();
  
  return (
    <div>
      <h1>{t.nav.inicio}</h1>
      <button onClick={() => setIdioma("en")}>English</button>
    </div>
  );
}
```

El selector de idioma está disponible en la barra de navegación superior (desktop) y persiste la preferencia en `localStorage`.

## 🎨 Paleta de Colores

- **Fondo principal**: `#0E1B2A`
- **Cards**: `#13253A`
- **Acento dorado**: `#C9A24D`
- **Terracota**: `#C08457`

## 🔧 Variables de Entorno

Crear archivo `.env.local` (opcional para futuras integraciones):

```env
# Placeholder para futuras variables
# NEXT_PUBLIC_API_URL=
# NEXT_PUBLIC_ANALYTICS_ID=
```

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar servidor de producción
npm start

# Linting
npm run lint
```

## 🚀 Deploy en Vercel

### Opción 1: Deploy desde GitHub

1. Conectar el repositorio a Vercel
2. Vercel detectará automáticamente Next.js
3. Configurar variables de entorno si es necesario
4. Deploy automático en cada push

### Opción 2: Deploy manual

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy a producción
vercel --prod
```

### Configuración en Vercel

- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (automático)
- **Output Directory**: `.next` (automático)
- **Install Command**: `npm install` (automático)

### Variables de Entorno (si aplica)

En el dashboard de Vercel, agregar variables de entorno en:
**Settings → Environment Variables**

## 🛠️ Tecnologías

- **Next.js 16** - Framework React
- **React 19** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Tailwind CSS 4** - Estilos
- **Sin librerías pesadas** - i18n custom, componentes propios

## 📝 Características

- ✅ Búsqueda de profesionales legales
- ✅ Gestión de casos con timeline
- ✅ Trámites migratorios con wizard
- ✅ Chat con bot de asistencia
- ✅ Gestores y oficiales de justicia
- ✅ Sistema de documentos
- ✅ Internacionalización (es/gn/en/pt)
- ✅ Diseño responsive
- ✅ Componentes reutilizables

## 🎯 Estado del Proyecto

**Demo para inversores** - Sin backend real, todos los datos son mock. La UI está completa y funcional para demostración.

## 📄 Licencia

Privado - Demo para inversores

## 👥 Contribución

Este es un proyecto demo. Para contribuciones, contactar al equipo de desarrollo.

---

**Nota**: Este proyecto no incluye backend. Todos los datos son mock y las funcionalidades son demostrativas.
