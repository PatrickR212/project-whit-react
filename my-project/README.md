## ESTRUCTURA DEL PROYECTO

my-project/ <br>
├── .next/                     # Archivos generados por Next.js para compilación<br>
├── node_modules/              # Dependencias del proyecto<br>
├── public/<br>
│   └── assets/                # Recursos estáticos como imágenes y SVG<br>
│       ├── file.svg<br>
│       ├── globe.svg<br>
│       ├── next.svg<br>
│       ├── vercel.svg<br>
│       └── window.svg<br>
├── src/<br>
│   ├── app/<br>
│   │   ├── about/             # Página de información "About"<br>
│   │   │   └── page.js<br>
│   │   ├── admin/             # Sección de administración<br>
│   │   │   └── products/<br>
│   │   │       ├── edit/[id]/page.js   # Página para editar un producto por ID<br>
│   │   │       ├── new/page.js         # Página para crear un nuevo producto<br>
│   │   │       └── page.js             # Listado de productos<br>
│   │   ├── users/                      # Sección de administración de usuarios<br>
│   │   │   └── edit/[id]/page.js       # Página para editar un usuario por ID<br>
│   │   │   └── page.js                 # Listado de usuarios<br>
│   │   ├── api/send-email/route.js     # Ruta para enviar correos desde el frontend<br>
│   │   ├── auth/                       # Autenticación<br>
│   │   │   ├── login/page.js           # Página de login<br>
│   │   │   └── profile/page.js         # Página de perfil del usuario<br>
│   │   └── register/page.js            # Página de registro de usuarios<br>
│   ├── cart/<br>
│   │   └── page.js                     # Página del carrito de compras<br>
│   ├── components/                     # Componentes reutilizables<br>
│   │   ├── MapComponent.js             # Componente de mapa<br>
│   │   └── navbar.js                   # Componente de barra de navegación<br>
│   ├── contact/<br>
│   │   └── page.js                     # Página de contacto<br>
│   ├── lib/<br>
│   │   └── axios.config.js             # Configuración de Axios para peticiones HTTP<br>
│   ├── pasarelas/<br>
│   │   └── page.js                     # Página para pasarelas de pago<br>
│   ├── pqrs/<br>
│   │   └── page.js                     # Página para Peticiones, Quejas, Reclamos y Sugerencias<br>
│   ├── products/<br>
│   │   └── page.js                     # Listado de productos<br>
│   ├── users/<br>
│   │   └── page.js                     # Listado de usuarios<br>
│   ├── context/<br>
│   │   ├── AuthContext.js              # Contexto de autenticación<br>
│   │   └── CartContext.js              # Contexto del carrito de compras<br>
│   └── styles/                         # Estilos CSS<br>
│       ├── contact.css<br>
│       ├── globals.css<br>
│       ├── Navbar.module.css<br>
│       └── pqrs.module.css<br>
├── .env.local                          # Variables de entorno para el entorno local<br>
├── .gitignore                          # Archivos y carpetas ignoradas por Git<br>
├── jsconfig.json                       # Configuración de rutas para imports<br>
├── next.config.mjs                     # Configuración de Next.js<br>
├── package-lock.json                   # Bloqueo de versiones de dependencias<br>
├── package.json                        # Dependencias y scripts del proyecto<br>
└── README.md                           # Documentación del proyecto<br>


## CARACTERISTICAS

1. Autenticación

Login y Registro de usuarios en la aplicación.

Página de perfil con datos del usuario.

2. Gestión de Productos y Usuarios (Admin)

Crear, listar, editar y eliminar productos.

Crear, listar, editar y eliminar usuarios.

3. Carrito de Compras

Permite agregar productos al carrito y ver el total.

4. Pasarela de Pagos

Página dedicada para la integración de pagos.

5. PQRS (Peticiones, Quejas, Reclamos y Sugerencias)

Sistema para recibir sugerencias y quejas de los usuarios.

6. Contacto y Mapa

Página de contacto y un mapa interactivo.

7. Context API para manejo de estado global

AuthContext para manejar el estado de autenticación.

CartContext para manejar el estado del carrito de compras.

8. Integración de Axios

Configuración centralizada para realizar peticiones HTTP.

9. Ruta de API para Enviar Correos

Enviar correos directamente desde la aplicación.