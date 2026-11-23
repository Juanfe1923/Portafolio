# Portafolio — Juan Felipe Uribe Romero

Portafolio web full stack de Juan Felipe Uribe Romero, Desarrollador Full Stack en Medellín, Colombia.

## Stack

- **Next.js 16** (App Router, TypeScript, Turbopack)
- **Tailwind CSS 4** (glassmorphism, paleta Dark Space Void)
- **Framer Motion** (animaciones de entrada, `whileInView`, carrusel de estados)
- **Lucide React 1.x** (íconos; el ícono de GitHub es un SVG propio porque lucide eliminó las marcas)
- **Plus Jakarta Sans + JetBrains Mono** vía `next/font`

## Secciones

1. Navbar flotante glassmorphic con seguimiento de sección activa y menú móvil.
2. Hero con badge de disponibilidad y widget interactivo `JuanFeDev.config.ts` (animación de escritura, resaltado de sintaxis, botón de repetición).
3. Matriz de habilidades por categorías (Frontend, Backend, Bases de Datos, Herramientas).
4. Showcase del proyecto Sigif con panel de control ilustrativo y enlace a la demo.
5. Línea de tiempo de educación y experiencia.
6. Contacto con formulario (abre el cliente de correo con `mailto:`), copia de email y footer.

## Comandos

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run start
npm run lint
```

## Estructura

```
src/
├── app/
│   ├── globals.css       # tema Tailwind v4, auroras, estilos del fondo
│   ├── layout.tsx        # fuentes, metadata, fondo cósmico
│   └── page.tsx          # composición de secciones
├── components/
│   ├── BackgroundCanvas.tsx
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── LiveCodeCard.tsx
│   ├── SectionHeading.tsx
│   ├── Skills.tsx
│   ├── ProjectSigif.tsx
│   ├── Timeline.tsx
│   ├── Contact.tsx
│   └── icons/GithubIcon.tsx
└── data/
    └── portfolioData.ts  # Todo el contenido editable en un solo lugar
```

> El formulario de contacto usa `mailto:` porque no se especificó un backend o servicio de correo. Si se desea envío real, reemplazar `handleSubmit` en `src/components/Contact.tsx` por una llamada a una ruta API.
