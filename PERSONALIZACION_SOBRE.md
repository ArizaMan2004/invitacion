# Personalización del Sobre

## Descripción
El sobre de la invitación puede personalizarse completamente con imágenes personalizadas. El sistema permite cambiar:
- **Imagen de fondo**: La parte trasera y laterales del sobre
- **Imagen de la tapa**: La solapa superior que se abre con animación

## Características del Sobre
- ✅ Animación 3D realista de apertura
- ✅ Se abre en secuencias: flap → sides → full open
- ✅ Personalizable con cualquier imagen
- ✅ Compatible con Supabase para almacenamiento

## Cómo Personalizar

### Opción 1: Cambiar en el Panel Admin
1. Accede a `/admin` con tus credenciales
2. Inicia sesión con correo y contraseña
3. Ve a la pestaña **"Personalización del Sobre"**
4. Ingresa las URLs de las imágenes:
   - **URL de la Imagen de Fondo del Sobre**: URL de la imagen del fondo (trasera y laterales)
   - **URL de la Imagen de la Tapa del Sobre**: URL de la imagen de la tapa/solapa que se abre
5. Haz clic en **"Guardar Imágenes del Sobre"**

### Opción 2: Cambiar en los Valores por Defecto
Edita `/lib/constants.ts` y cambia:
```typescript
envelopeBackImage: '/images/envelope-back.jpg',
envelopeFlapImage: '/images/envelope-flap.jpg',
```

## Recomendaciones de Imágenes

### Dimensiones
- **Imagen de Fondo**: Mínimo 800x600px (preferiblemente 1200x900px)
- **Imagen de Tapa**: Mínimo 800x400px (preferiblemente 1200x600px)

### Estilo
Para mantener la coherencia con la invitación:
- Usar colores azul y dorado como colores principales
- Incluir detalles elegantes y decorativos
- Mantener un diseño profesional
- Considerar textura de papel

### Hosting de Imágenes
Puedes alojar las imágenes en:
- Supabase Storage (recomendado)
- Vercel Blob
- Cloudinary
- Imgur
- Google Drive (con enlace público)

## Estructura del Sobre (3D)

El sobre tiene 5 partes:
```
1. Flap (Tapa) - Rota hacia arriba
2. Back (Fondo) - Centro del sobre
3. Left Panel (Panel Izquierdo) - Se abre hacia la izquierda
4. Right Panel (Panel Derecho) - Se abre hacia la derecha
5. Bottom (Parte Inferior) - Donde aparece la invitación
```

## Animación de Apertura

Secuencia de animación:
1. **Flap Opens** (1.2s): La tapa se abre hacia arriba con rotación 3D
2. **Sides Slide** (0.8s): Los paneles laterales se abren hacia los lados
3. **Full Open** (0.5s): Se revela completamente la invitación
4. **Total**: Aproximadamente 2.5 segundos

## Función en Supabase

Las imágenes se guardan en la tabla `invitations`:
- Campo: `envelope_back_image` (URL del fondo)
- Campo: `envelope_flap_image` (URL de la tapa)

## Código del Componente

El componente `RealisticEnvelope.tsx` contiene:
- Animaciones 3D con Framer Motion
- Transformaciones CSS 3D
- Detección de clics para abrir
- Sello decorativo XV en la tapa

## Ejemplos de Colores Recomendados

- Azul claro: `#2563EB`
- Azul oscuro: `#1E40AF`
- Dorado: `#FCD34D`
- Blanco: `#FFFFFF`

## Solución de Problemas

### La imagen no se carga
- Verifica que la URL sea pública
- Asegúrate de que la imagen tenga al menos 800x600px
- Prueba con una URL HTTPS

### El sobre se ve pixelado
- Aumenta la resolución de la imagen
- Usa una imagen de mayor tamaño

### La animación es lenta
- Verifica la velocidad de tu conexión a internet
- La animación está optimizada y debería ser suave

## Próximas Mejoras

- [ ] Upload directo de imágenes al admin
- [ ] Generador de skins automático
- [ ] Presets de sobres prediseñados
- [ ] Customización de colores en tiempo real
