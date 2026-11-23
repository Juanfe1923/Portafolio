export const profile = {
  name: "Juan Felipe Uribe Romero",
  shortName: "Juan Felipe",
  role: "Desarrollador Full Stack",
  location: "Medellín, Colombia",
  focus:
    "Desarrollo enfocado en rendimiento, seguridad, diseño y experiencia de usuario.",
  email: "felipeuribe778@gmail.com",
  github: "https://github.com/juanfe1923",
  githubUser: "juanfe1923",
  available: true,
};

export const navLinks = [
  { id: "inicio", label: "Inicio" },
  { id: "habilidades", label: "Habilidades" },
  { id: "proyecto", label: "Proyectos" },
  { id: "trayectoria", label: "Trayectoria" },
  { id: "contacto", label: "Contacto" },
];

export type SkillItem = {
  name: string;
  icon: string;
  tag: string;
  detail: string;
  level: number; // percentage for visual meter
};

export type SkillCategory = {
  id: "frontend" | "backend" | "databases" | "tools" | "mobile";
  title: string;
  description: string;
  accent: "cyan" | "violet" | "emerald" | "sky";
  items: SkillItem[];
};

export const skillCategories: SkillCategory[] = [
  {
    id: "frontend",
    title: "Frontend",
    description: "Interfaces interactivas, accesibles y con rendimiento estricto.",
    accent: "cyan",
    items: [
      {
        name: "React",
        icon: "atom",
        tag: "Core Library",
        detail: "Componentes reactivos, hooks personalizados, virtual DOM y Next.js.",
        level: 90,
      },
      {
        name: "HTML5",
        icon: "file-code",
        tag: "Semántica",
        detail: "Estructura semántica limpia, accesibilidad WCAG y SEO técnico.",
        level: 95,
      },
      {
        name: "CSS3",
        icon: "palette",
        tag: "Estilos & 3D",
        detail: "Diseño responsive, Flexbox, Grid, animaciones y transformaciones 3D.",
        level: 92,
      },
      {
        name: "Bootstrap",
        icon: "layout",
        tag: "UI Framework",
        detail: "Prototipado rápido de interfaces modulares y rejillas adaptables.",
        level: 88,
      },
    ],
  },
  {
    id: "mobile",
    title: "Mobile & Multiplataforma",
    description: "Apps nativas para iOS y Android con un solo código base.",
    accent: "sky",
    items: [
      {
        name: "Flutter",
        icon: "smartphone",
        tag: "Mobile · iOS & Android",
        detail:
          "Desarrollo de aplicaciones móviles nativas con Dart y Flutter. Widgets declarativos, estado con Provider/Riverpod y sincronización en tiempo real.",
        level: 75,
      },
      {
        name: "Dart",
        icon: "code-2",
        tag: "Lenguaje Flutter",
        detail:
          "Lenguaje fuertemente tipado, orientado a objetos, con null-safety y async/await nativo que potencia Flutter.",
        level: 72,
      },
    ],
  },
  {
    id: "backend",
    title: "Backend",
    description: "Lógica robusta, APIs REST seguras y servicios escalables.",
    accent: "violet",
    items: [
      {
        name: "Python",
        icon: "terminal",
        tag: "Lenguaje Principal",
        detail: "Programación orientada a objetos, scripts y lógica de negocio sólida.",
        level: 90,
      },
      {
        name: "Django",
        icon: "server",
        tag: "Framework Backend",
        detail: "Django REST Framework, ORM avanzado, autenticación y seguridad.",
        level: 88,
      },
      {
        name: "Node.js",
        icon: "hexagon",
        tag: "Runtime",
        detail: "Servicios asíncronos en JavaScript, manejo de eventos y APIs.",
        level: 82,
      },
      {
        name: "JavaScript",
        icon: "braces",
        tag: "Full Stack",
        detail: "ES6+, manipulación de datos asíncrona, promesas y consumo de APIs.",
        level: 90,
      },
      {
        name: "APIs REST",
        icon: "network",
        tag: "Arquitectura",
        detail: "Diseño de endpoints consistentes, serialización y autenticación JWT.",
        level: 92,
      },
    ],
  },
  {
    id: "databases",
    title: "Bases de Datos",
    description: "Modelado relacional eficiente y almacenamiento optimizado.",
    accent: "emerald",
    items: [
      {
        name: "PostgreSQL",
        icon: "database-zap",
        tag: "Relacional Avanzado",
        detail: "Consultas complejas, índices, integridad referencial y Supabase.",
        level: 88,
      },
      {
        name: "MySQL",
        icon: "database",
        tag: "Relacional",
        detail: "Diseño de tablas, normalización de datos y consultas transaccionales.",
        level: 85,
      },
      {
        name: "MongoDB",
        icon: "leaf",
        tag: "NoSQL",
        detail: "Colecciones flexibles basadas en documentos BSON/JSON.",
        level: 80,
      },
    ],
  },
  {
    id: "tools",
    title: "Herramientas",
    description: "Flujo de trabajo profesional, contenedorización y testing.",
    accent: "sky",
    items: [
      {
        name: "Git",
        icon: "git-branch",
        tag: "Control de Versiones",
        detail: "Ramificación estratégica, control de versiones distribuido y merges limpios.",
        level: 92,
      },
      {
        name: "GitHub",
        icon: "github",
        tag: "Colaboración",
        detail: "Gestión de repositorios, Pull Requests, issues y despliegues CI/CD.",
        level: 90,
      },
      {
        name: "Docker",
        icon: "container",
        tag: "Contenedores",
        detail: "Entornos reproducibles, Dockerfile y contenedores aislados.",
        level: 78,
      },
      {
        name: "Postman",
        icon: "send",
        tag: "Testing de APIs",
        detail: "Automatización de pruebas de endpoints, colecciones y validación de esquemas.",
        level: 90,
      },
    ],
  },
];

export const sigifProject = {
  name: "Sigif",
  tagline: "Administración integral de negocios, sin fricción.",
  summary:
    "Ecosistema web y móvil para administración empresarial en producción: control de inventario sincronizado en tiempo real, facturación electrónica y contabilidad centralizada.",
  demoUrl: "https://sigif-final.vercel.app/",
  technologies: ["Django", "Supabase (PostgreSQL)", "API REST", "Vercel", "Mobile Sync"],
  metrics: [
    { label: "Sincronización", value: "Realtime", detail: "Web ↔ App Móvil" },
    { label: "Base de Datos", value: "PostgreSQL", detail: "Supabase Cloud" },
    { label: "Disponibilidad", value: "99.9%", detail: "Desplegado en Vercel" },
  ],
  features: [
    {
      title: "Inventario síncrono multidireccional",
      description:
        "Cada movimiento en la caja o almacén actualiza instantáneamente los stocks en la web y la app móvil.",
    },
    {
      title: "Reportes contables automatizados",
      description:
        "Balances financieros, ventas diarias y balances de costos generados al instante sin trabajo manual.",
    },
    {
      title: "Comunicación segura con API REST",
      description:
        "Endpoints protegidos que permiten a la aplicación móvil y al panel administrativo operar como una sola unidad.",
    },
  ],
};

export const timeline = [
  {
    period: "2026",
    badge: "GRADUACIÓN & ESPECIALIZACIÓN",
    title: "Tecnólogo en Análisis y Desarrollo de Software",
    description:
      "Formación integral de alto nivel en todo el ciclo de vida del software: análisis de requerimientos, diseño de arquitecturas seguras, modelado de bases de datos, desarrollo backend y frontend, testing y despliegue continuo.",
    icon: "graduation",
    highlights: ["Patrones de arquitectura", "Bases de datos relacionales", "Despliegues en producción"],
  },
  {
    period: "Presente",
    badge: "DESARROLLO ACTIVO",
    title: "Desarrollador Full Stack Independiente",
    description:
      "Diseño y construcción de soluciones digitales completas de extremo a extremo. Creación de Sigif (sistema de gestión empresarial en producción con Django, PostgreSQL y Vercel) y aplicaciones web interactivas con Next.js y React.",
    icon: "rocket",
    highlights: ["Arquitecturas Full Stack", "Experiencia de usuario 3D & reactiva", "APIs REST seguras"],
  },
];

export type CodeToken = { text: string; className: string };

// Token classes: kw (keyword), str (string), fn (function), prop, punct, num, bool, comment
export const liveCodeLines: CodeToken[][] = [
  [
    { text: "export const", className: "kw" },
    { text: " JuanFeDev", className: "fn" },
    { text: " = {", className: "punct" },
  ],
  [
    { text: "  nombre", className: "prop" },
    { text: ": ", className: "punct" },
    { text: '"Juan Felipe Uribe Romero"', className: "str" },
    { text: ",", className: "punct" },
  ],
  [
    { text: "  rol", className: "prop" },
    { text: ": ", className: "punct" },
    { text: '"Full Stack Developer"', className: "str" },
    { text: ",", className: "punct" },
  ],
  [
    { text: "  ubicacion", className: "prop" },
    { text: ": ", className: "punct" },
    { text: '"Medellín, Colombia"', className: "str" },
    { text: ",", className: "punct" },
  ],
  [
    { text: "  stack", className: "prop" },
    { text: ": [", className: "punct" },
    { text: '"React"', className: "str" },
    { text: ", ", className: "punct" },
    { text: '"Django"', className: "str" },
    { text: ", ", className: "punct" },
    { text: '"Node.js"', className: "str" },
    { text: "],", className: "punct" },
  ],
  [
    { text: "  enfoque", className: "prop" },
    { text: ": [", className: "punct" },
    { text: '"rendimiento"', className: "str" },
    { text: ", ", className: "punct" },
    { text: '"seguridad"', className: "str" },
    { text: "],", className: "punct" },
  ],
  [
    { text: "  disponible", className: "prop" },
    { text: ": ", className: "punct" },
    { text: "true", className: "bool" },
    { text: ",", className: "punct" },
  ],
  [
    { text: "  construir", className: "prop" },
    { text: ": () ", className: "punct" },
    { text: "=>", className: "kw" },
    { text: " ", className: "punct" },
    { text: '"ideas → productos reales"', className: "str" },
    { text: ",", className: "punct" },
  ],
  [{ text: "};", className: "punct" }],
];
