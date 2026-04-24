# Invitación Interactiva a Quinceañera

Una aplicación elegante y completamente personalizable para compartir la invitación a los 15 años de una quinceañera.

## Características

### Para Invitados
- **Sobre Animado**: Animación realista de apertura de sobre al cargar la página
- **Invitación Completa**: Vista de toda la información del evento
- **Confirmación RSVP**: Formulario para confirmar asistencia con detalles de acompañantes y restricciones dietéticas
- **Galería de Fotos**: Visualización de fotos del evento
- **Información del Evento**: Fecha, hora, lugar con mapa, código de vestimenta
- **Contador Regresivo**: Días, horas, minutos y segundos para el evento
- **Mensajes**: Los invitados pueden dejar dedicatorias (sujetas a aprobación)

### Para Administrador
- **Acceso Seguro**: Autenticación con correo y contraseña
- **Panel de Control**: Ubicado en `/admin`
- **Gestión de Respuestas**: Ver todas las confirmaciones RSVP de los invitados
- **Moderación de Fotos**: Revisar y aprobar fotos subidas por invitados
- **Moderación de Mensajes**: Revisar y aprobar dedicatorias de invitados
- **Personalización Completa**: Cambiar nombre, fecha, lugar, imágenes (desde el panel admin)

## Cómo Ejecutar Localmente

### Requisitos
- Node.js (v18 o superior)
- npm, yarn, pnpm o bun

### Instalación

1. **Descargar el proyecto** desde v0 (botón en esquina superior derecha)

2. **Instalar dependencias**:
```bash
pnpm install
# o
npm install
```

3. **Configurar variables de entorno**:
Crea un archivo `.env.local` en la raíz del proyecto con tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Ejecutar el servidor**:
```bash
pnpm dev
# o
npm run dev
```

5. **Acceder a la aplicación**:
- Invitación: http://localhost:3000
- Panel Admin: http://localhost:3000/admin

## Cómo Usar

### Para Invitados

1. Accede a `http://localhost:3000`
2. Verás un sobre animado - **haz clic en "Abrir Sobre"**
3. Se desplegará la invitación completa con:
   - Nombre de la quinceañera
   - Contador regresivo
   - Fecha y hora del evento
   - Ubicación con mapa
   - Galería de fotos
   - Formulario RSVP
   - Código de vestimenta
   - Dedicatoria

4. **Completar RSVP**:
   - Ingresa tu nombre, correo y teléfono
   - Confirma si asistirás
   - Indica número de acompañantes
   - Especifica restricciones dietéticas (opcional)
   - Deja un mensaje dedicado (opcional)
   - **Envía**

### Para el Administrador

1. Accede a `http://localhost:3000/admin`
2. **Inicia sesión**:
   - Correo: `admin@example.com`
   - Contraseña: Tu contraseña configurada en Supabase

3. **Gestiona el contenido**:
   - **RSVP**: Ve todas las respuestas de los invitados
   - **Fotos**: Aprueba fotos subidas por invitados
   - **Mensajes**: Aprueba dedicatorias de invitados

## Configuración de Supabase

### Crear las Tablas

1. Ve a tu proyecto en [Supabase](https://supabase.com)
2. Ve a **SQL Editor**
3. Copia y pega el contenido de `scripts/01_create_tables.sql`
4. **Ejecuta**

### Tablas Creadas

- `invitations` - Información del evento
- `rsvp_responses` - Confirmaciones de asistencia
- `guest_photos` - Fotos de invitados
- `guest_messages` - Mensajes y dedicatorias
- `admin_users` - Credenciales de administrador

## Personalización

### Cambiar Datos de la Invitación

Desde el panel admin (`/admin`), puedes cambiar:
- Nombre de la quinceañera
- Fecha y hora del evento
- Ubicación
- Código de vestimenta
- Mensaje de dedicatoria
- Fotos de la galería

### Crear Admin

Para crear un nuevo usuario administrador, usa la consola de Supabase:

```sql
INSERT INTO admin_users (email, password_hash, invitation_id)
VALUES ('tu@correo.com', 'tu_contraseña', 'invitation_id');
```

## Seguridad

⚠️ **Importante para Producción**:

1. **No uses contraseñas en texto plano** - Implementa bcrypt o similar
2. **Cambia las credenciales de admin** antes de publicar
3. **Activa Row Level Security (RLS)** en todas las tablas de Supabase
4. **Usa variables de entorno seguras** en tu hosting
5. **Considera Supabase Auth** para mayor seguridad

## Estructura del Proyecto

```
/app
  /admin           # Panel de administración
  /api            # Endpoints API
  layout.tsx      # Layout principal
  page.tsx        # Página principal
/components
  /invitation     # Componentes de la invitación
  AnimatedEnvelope.tsx  # Sobre animado
  InvitationSPA.tsx     # SPA principal
/lib
  supabase.ts     # Utilidades de Supabase
  types.ts        # Tipos TypeScript
  constants.ts    # Datos por defecto
/public
  /images         # Imágenes generadas
/scripts
  01_create_tables.sql  # Schema de base de datos
```

## Soporte

Para problemas o preguntas:
1. Verifica que Supabase esté configurado correctamente
2. Revisa la consola del navegador para errores
3. Asegúrate de que las variables de entorno están configuradas

## Tecnologías Usadas

- **Next.js 15** - Framework React
- **Tailwind CSS v4** - Estilos
- **Framer Motion** - Animaciones
- **Supabase** - Base de datos y autenticación
- **TypeScript** - Tipado estático

---

¡Disfruta compartiendo esta invitación especial! 🎉
