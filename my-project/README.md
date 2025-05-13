## ESTRUCTURA DEL PROYECTO

my-project/
├── .next/                     # Archivos generados por Next.js para compilación
├── node_modules/              # Dependencias del proyecto
├── public/
│   └── assets/                # Recursos estáticos como imágenes y SVG
│       ├── file.svg
│       ├── globe.svg
│       ├── next.svg
│       ├── vercel.svg
│       └── window.svg
├── src/
│   ├── app/
│   │   ├── about/             # Página de información "About"
│   │   │   └── page.js
│   │   ├── admin/             # Sección de administración
│   │   │   └── products/
│   │   │       ├── edit/[id]/page.js   # Página para editar un producto por ID
│   │   │       ├── new/page.js         # Página para crear un nuevo producto
│   │   │       └── page.js             # Listado de productos
│   │   ├── users/                      # Sección de administración de usuarios
│   │   │   └── edit/[id]/page.js       # Página para editar un usuario por ID
│   │   │   └── page.js                 # Listado de usuarios
│   │   ├── api/send-email/route.js     # Ruta para enviar correos desde el frontend
│   │   ├── auth/                       # Autenticación
│   │   │   ├── login/page.js           # Página de login
│   │   │   └── profile/page.js         # Página de perfil del usuario
│   │   └── register/page.js            # Página de registro de usuarios
│   ├── cart/
│   │   └── page.js                     # Página del carrito de compras
│   ├── components/                     # Componentes reutilizables
│   │   ├── MapComponent.js             # Componente de mapa
│   │   └── navbar.js                   # Componente de barra de navegación
│   ├── contact/
│   │   └── page.js                     # Página de contacto
│   ├── lib/
│   │   └── axios.config.js             # Configuración de Axios para peticiones HTTP
│   ├── pasarelas/
│   │   └── page.js                     # Página para pasarelas de pago
│   ├── pqrs/
│   │   └── page.js                     # Página para Peticiones, Quejas, Reclamos y Sugerencias
│   ├── products/
│   │   └── page.js                     # Listado de productos
│   ├── users/
│   │   └── page.js                     # Listado de usuarios
│   ├── context/
│   │   ├── AuthContext.js              # Contexto de autenticación
│   │   └── CartContext.js              # Contexto del carrito de compras
│   └── styles/                         # Estilos CSS
│       ├── contact.css
│       ├── globals.css
│       ├── Navbar.module.css
│       └── pqrs.module.css
├── .env.local                          # Variables de entorno para el entorno local
├── .gitignore                          # Archivos y carpetas ignoradas por Git
├── jsconfig.json                       # Configuración de rutas para imports
├── next.config.mjs                     # Configuración de Next.js
├── package-lock.json                   # Bloqueo de versiones de dependencias
├── package.json                        # Dependencias y scripts del proyecto
└── README.md                           # Documentación del proyecto


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