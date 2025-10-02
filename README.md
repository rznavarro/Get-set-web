# PORTFOLIO CEO - Real Estate Investment Management

Una aplicación web para gestionar portfolios inmobiliarios con análisis inteligente impulsado por IA.

## 🚀 Características

- **Formulario de Inversión Completo**: Captura información detallada de propiedades, finanzas y objetivos
- **Análisis IA**: Genera resúmenes ejecutivos y recomendaciones usando n8n webhooks
- **Dashboard Interactivo**: Visualiza métricas clave y oportunidades de inversión
- **Base de Datos Supabase**: Almacenamiento persistente y seguro de datos
- **Interfaz Responsiva**: Optimizada para desktop y móvil

## 🛠️ Tecnologías

- **Frontend**: React + TypeScript + Vite
- **UI**: Tailwind CSS + Lucide Icons
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **IA**: n8n webhooks para análisis inteligente
- **Estado**: localStorage + Supabase

## 📋 Prerrequisitos

- Node.js 18+
- npm o pnpm
- Docker (opcional, para desarrollo local con Supabase)

## 🔧 Instalación y Configuración

### 1. Clona el repositorio
```bash
git clone <repository-url>
cd portfolio-ceo
```

### 2. Instala dependencias
```bash
npm install
```

### 3. Configura Supabase

#### Opción A: Usar Supabase Cloud (Recomendado)
1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Ve a Settings > API y copia:
   - Project URL
   - Anon public key

#### Opción B: Desarrollo Local con Docker
```bash
# Instala Supabase CLI
npm install -g supabase

# Inicia Supabase localmente
npx supabase start
```

### 4. Configura variables de entorno

Edita el archivo `.env`:
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

### 5. Ejecuta las migraciones de base de datos

Si usas Supabase Cloud:
1. Ve al SQL Editor en tu dashboard de Supabase
2. Copia y pega el contenido de `supabase/migrations/20240927000001_create_portfolio_tables.sql`
3. Ejecuta la migración

Si usas desarrollo local:
```bash
npx supabase db push
```

### 6. Inicia la aplicación
```bash
npm run dev
```

## 📊 Estructura de la Base de Datos

### Tablas Principales

- **investors**: Información del inversionista
- **properties**: Propiedades inmobiliarias
- **property_units**: Unidades individuales de cada propiedad
- **goals_priorities**: Objetivos y prioridades del inversionista
- **market_info**: Información del mercado local
- **analysis_data**: Datos de análisis generados por IA

### Relaciones

```
investors (1) ──── (N) properties
properties (1) ──── (N) property_units
investors (1) ──── (1) goals_priorities
investors (1) ──── (1) market_info
investors (1) ──── (N) analysis_data
```

## 🔄 Flujo de la Aplicación

1. **Login**: Autenticación simple (localStorage)
2. **Formulario**: Captura datos completos del portfolio
3. **Procesamiento**: Envío a n8n para análisis IA
4. **Almacenamiento**: Guardado en Supabase
5. **Dashboard**: Visualización de métricas y recomendaciones

## 🚀 Despliegue

### Build de Producción
```bash
npm run build
```

### Despliegue en Vercel/Netlify
1. Sube el código a tu repositorio
2. Conecta con Vercel/Netlify
3. Configura las variables de entorno
4. Despliega

## 🔒 Seguridad

- **Row Level Security (RLS)**: Habilitado en todas las tablas
- **Políticas de Acceso**: Configuradas para operaciones básicas
- **Variables de Entorno**: Credenciales sensibles en `.env`
- **Validación**: Datos validados en frontend y backend

## 🐛 Solución de Problemas

### Error de conexión a Supabase
- Verifica las variables de entorno en `.env`
- Asegúrate de que las URLs y keys sean correctas
- Revisa la consola del navegador para errores

### Migraciones no aplicadas
- Para desarrollo local: `npx supabase db reset`
- Para producción: Ejecuta manualmente en SQL Editor

### Datos no se guardan
- Verifica permisos de RLS en Supabase
- Revisa logs de la aplicación
- Fallback automático a localStorage

## 📝 Desarrollo

### Comandos Disponibles
```bash
npm run dev          # Inicia servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Vista previa del build
npm run lint         # Ejecuta ESLint
```

### Estructura del Proyecto
```
src/
├── components/       # Componentes React
├── lib/             # Utilidades y configuración
│   ├── api.ts       # Funciones de API
│   └── supabase.ts  # Cliente Supabase
├── App.tsx          # Componente principal
└── main.tsx         # Punto de entrada

supabase/
└── migrations/      # Migraciones de base de datos
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas:
- Abre un issue en GitHub
- Revisa la documentación de Supabase
- Consulta los logs de la aplicación

---

**Desarrollado con ❤️ para inversionistas inmobiliarios**
