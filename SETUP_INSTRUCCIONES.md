# Invitación Quinceañera - Guía de Configuración

## 🎉 Bienvenido

Esta es una aplicación completa de invitación a la quinceañera con:
- ✨ Invitación elegante interactiva
- 📝 Sistema de RSVP (confirmación de asistencia)
- 📸 Galería de fotos de invitados (con aprobación)
- 💬 Mensajes y dedicatorias (con aprobación)
- 🔐 Panel de administración para gestionar todo

## 🚀 Instalación Local

### Requisitos
- Node.js 16+ instalado
- pnpm, npm o yarn como gestor de paquetes

### Pasos

1. **Descargar el proyecto**
   - Descargar el ZIP del proyecto desde v0
   - Descomprimirlo en tu carpeta deseada

2. **Instalar dependencias**
   ```bash
   pnpm install
   ```

3. **Configurar variables de entorno**
   - El proyecto ya tiene las variables de Supabase configuradas en Vercel
   - Si ejecutas localmente, crea un archivo `.env.local` con:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Ejecutar en desarrollo**
   ```bash
   pnpm dev
   ```
   Abre http://localhost:3000 en tu navegador

## 📋 Usando la Aplicación

### Para Invitados (Acceso Público)

1. **Ver la invitación**: Se abre un sobre animado, haz clic en "Abrir Invitación"
2. **Confirmar asistencia**: Completa el formulario RSVP con:
   - Tu nombre
   - Correo electrónico
   - Teléfono (opcional)
   - Si asistirás o no
   - Número de acompañantes
   - Restricciones dietéticas
   - Mensaje personalizado (opcional)

3. **Los datos se guardan automáticamente en Supabase**

### Para Administrador (Panel Privado)

1. **Acceder al panel**: Ve a `http://localhost:3000/admin`
2. **Contraseña**: `admin123` (⚠️ Cambiar en producción en `/app/admin/page.tsx`)
3. **Ingresar ID de invitación**: 
   - Encuentrala en los logs de la consola o en la base de datos Supabase
   - Formato: `550e8400-e29b-41d4-a716-446655440000`

4. **Gestionar datos**:
   - **RSVP**: Ver todas las respuestas de invitados (nombre, email, asistencia, etc.)
   - **Fotos**: Aprobar fotos subidas por invitados
   - **Mensajes**: Aprobar dedicatorias y mensajes

## 🎨 Personalizar la Invitación

### En Modo Admin (mientras ves la invitación)
- Haz clic en el toggle "Modo Admin" en la esquina superior derecha
- Se mostrarán bordes punteados en elementos editables
- Puedes editar:
  - Nombre de la quinceañera
  - Fecha y hora
  - Ubicación
  - Fotos de la galería
  - Código de vestimenta
  - Mensaje de dedicatoria

### Editar datos por defecto
Edita el archivo `/lib/constants.ts`:
```typescript
export const DEFAULT_INVITATION_DATA: InvitationData = {
  quinceaneraName: 'María Elena',
  eventDate: '2024-12-15',
  eventTime: '19:00',
  // ... más campos
};
```

## 🗄️ Base de Datos Supabase

### Tablas creadas:
1. **invitations**: Información principal de la invitación
2. **rsvp_responses**: Respuestas de confirmación de invitados
3. **guest_photos**: Fotos subidas por invitados (requieren aprobación)
4. **guest_messages**: Mensajes y dedicatorias (requieren aprobación)
5. **gallery_photos**: Fotos de la galería oficial
6. **admin_users**: Usuarios administradores (para expansión futura)

### Seguridad (Row Level Security - RLS)
- ✅ Todos pueden VER la invitación
- ✅ Todos pueden CREAR respuestas RSVP, fotos y mensajes
- ❌ Solo admin puede EDITAR y APROBAR contenido
- ❌ Las fotos/mensajes no aprobados NO son visibles públicamente

## 🔐 Seguridad Importante

⚠️ **ANTES DE PUBLICAR EN PRODUCCIÓN:**

1. **Cambiar contraseña de admin**:
   - Edita `/app/admin/page.tsx` línea 9
   - Reemplaza `'admin123'` con una contraseña fuerte

2. **Activar autenticación real**:
   - Considera usar Supabase Auth en lugar de contraseña simple
   - Crea tabla `admin_users` con contraseñas hasheadas

3. **Configurar storage de Supabase**:
   - Para subida de fotos, crea buckets en Supabase Storage:
     - `guest-photos` (para fotos de invitados)
     - `gallery-photos` (para galería oficial)

4. **Implementar límites de rate**:
   - Para evitar spam de RSVP/mensajes
   - Considera agregar verificación de email

## 📱 Responsive Design

La aplicación es totalmente responsiva:
- ✅ Móvil (320px+)
- ✅ Tablet (768px+)
- ✅ Desktop (1024px+)

## 🚀 Desplegar en Vercel

1. Conecta tu repositorio GitHub a Vercel
2. Las variables de entorno ya están configuradas
3. Deploy automático en cada push

```bash
# O deploy manual
pnpm run build
pnpm run start
```

## 🛠️ Troubleshooting

### La página está en blanco
- Verifica que Supabase esté configurado correctamente
- Revisa la consola del navegador (F12) para ver errores
- Comprueba las variables de entorno

### Las fotos no se suben
- Verifica que los buckets de Supabase Storage estén creados
- Comprueba los permisos RLS en Supabase

### El admin no accede
- Verifica la contraseña en `/app/admin/page.tsx`
- Clearea localStorage si hay problemas: `localStorage.clear()`

## 📚 Estructura del Proyecto

```
/app
  /admin - Panel de administración
  /api - Endpoints de API
  /page.tsx - Página principal
  /layout.tsx - Layout principal
/components
  /invitation - Componentes de la invitación
    /RSVPForm.tsx - Formulario (ahora con Supabase)
    /PhotoGallery.tsx - Galería
    ... más componentes
  /AnimatedEnvelope.tsx - Sobre animado
  /InvitationSPA.tsx - Aplicación principal
/lib
  /supabase.ts - Funciones de Supabase (NEW!)
  /types.ts - Tipos TypeScript
  /constants.ts - Constantes de datos
  /utils.ts - Utilidades
/public
  /images - Imágenes generadas
/scripts
  /01_create_tables.sql - Schema SQL
```

## 💡 Próximas Mejoras Sugeridas

1. Autenticación de admin con Supabase Auth
2. Subida de fotos con preview
3. Envío de emails de confirmación
4. Integración de Google Maps real
5. Contador de confirmaciones en tiempo real
6. Exportar respuestas a Excel/PDF
7. Cambiar tema de colores desde admin
8. Notificaciones en tiempo real

## ❓ Preguntas Frecuentes

**¿Puedo cambiar el color de la invitación?**
Sí, edita las clases Tailwind en los componentes. Busca `bg-amber-` y reemplaza con otro color.

**¿Cuántos invitados pueden usar esto?**
Ilimitados. Supabase soporta millones de registros.

**¿Los datos se pierden?**
No, todo está en Supabase. Los datos persisten siempre.

**¿Puedo agregar más secciones?**
Sí, crea nuevos componentes en `/components/invitation/` y agrégalos a `InvitationSPA.tsx`.

---

¡Disfruta tu quinceañera! 🎉✨
