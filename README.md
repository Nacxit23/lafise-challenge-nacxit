# LAFISE Digital Banking

Aplicación web demostrativa de banca digital desarrollada para el challenge técnico de LAFISE. Permite consultar una cuenta, revisar movimientos, realizar transferencias simuladas y utilizar servicios financieros de demostración.

> Este proyecto utiliza un mock API. Las operaciones no representan transacciones bancarias reales.

## 1. Instalación y ejecución local

### Requisitos

- Node.js 18 o superior.
- Yarn 1.x para el frontend.
- npm para el mock API.

### Instalar dependencias

Desde la raíz del proyecto:

```bash
yarn install
npm install --prefix apps/api
```

### Configurar el frontend

Crea el archivo apps/web/.env.local con:

```env
API_URL=http://localhost:5566
```

El frontend utiliza la ruta proxy de Next.js /api/backend para comunicarse con el mock y evitar problemas de CORS.

### Ejecutar la aplicación completa

```bash
yarn dev
```

Servicios disponibles:

- Frontend Next.js: http://localhost:3000
- Mock API: http://localhost:5566
- Swagger UI: http://localhost:5567

También puedes ejecutar cada parte por separado:

```bash
yarn dev:api
yarn dev:web
```

Para iniciar únicamente Swagger:

```bash
npm --prefix apps/api run start-apidocs
```

## 2. Cómo iniciar sesión

Abre http://localhost:3000 o la versión publicada en https://lafise-challenge-nacxit.vercel.app/.

Credenciales públicas del entorno demo:

```text
Usuario: josueperez26
Contraseña: lafiseDemouser
```

Flujo de acceso:

1. Ingresa el usuario y la contraseña.
2. Presiona Ingresar.
3. La aplicación consulta POST /auth/login.
4. Si las credenciales son válidas, guarda la sesión localmente y muestra el dashboard.

## 3. Módulos y funcionalidades

### Autenticación

- Inicio de sesión con credenciales demo.
- Persistencia de la sesión en el navegador.
- Protección de las vistas internas.
- Cierre de sesión.

### Dashboard de cuenta

- Consulta de la cuenta bancaria demo.
- Número de cuenta enmascarado.
- Saldo disponible.
- Accesos rápidos a transferencias, pagos y recargas.
- Diseño responsive.

### Movimientos de cuenta

- Historial en tabla para escritorio y tarjetas para móvil.
- Detalle de cada movimiento.
- Filtro por mes.
- Búsqueda por número de transacción.
- Filtro por monto exacto o rango.
- Identificación visual de débitos y créditos.
- El filtro mensual inicia en Todos los meses.

La transacción inicial del mock es:

```text
Descripción: Paga quincenal
Fecha: 15 de agosto de 2026
Monto: C$1,000.00
Tipo: Credit
```

### Transferencias

El flujo se divide en tres pasos:

1. Ingreso de cuenta destino y monto.
2. Confirmación de los datos.
3. Resultado exitoso con referencia y saldo restante.

El saldo se valida antes de confirmar y el débito se refleja inmediatamente en el dashboard y en el historial local.

### Servicios financieros demo

Desde Servicios se pueden ejecutar estos flujos:

- Retiro sin tarjeta: genera un código de retiro.
- Recargas celulares: simula recargas para Claro o Tigo.
- Pago de servicios: simula pagos de electricidad, agua y telecomunicaciones.

Cada operación valida el saldo, muestra una confirmación y registra un movimiento local.

## 4. Tecnologías

- Next.js 16 con App Router.
- React 19 y TypeScript.
- Tailwind CSS.
- Zustand para estado global y persistencia local.
- Axios para peticiones HTTP.
- React Hook Form y Zod para formularios y validaciones.
- Radix UI y componentes reutilizables.
- Lucide React para iconografía.
- Mockoon CLI para el backend simulado.
- Swagger UI para el contrato del API.
- Vercel para el frontend desplegado.

## 5. Estructura general

```text
.
├── apps/
│   ├── api/                         # Mock backend independiente
│   └── web/                         # Aplicación Next.js
├── scripts/
│   └── dev.mjs                      # Inicia API y frontend juntos
├── package.json                     # Scripts y workspace principal
├── yarn.lock                        # Dependencias Yarn
└── README.md                        # Documentación global
```

### apps/web/src/app

Define las rutas y la composición principal de Next.js.

```text
apps/web/src/app/
├── layout.tsx                        # Layout raíz, metadata, fuentes y auth
├── page.tsx                          # Página inicial: dashboard
├── globals.css                       # Estilos globales
├── (dashboard)/                      # Rutas protegidas del dashboard
│   ├── account-transactions/         # Historial y transferencias
│   ├── services/                     # Menú de servicios
│   ├── cardless-withdrawal/          # Retiro sin tarjeta
│   ├── mobile-recharges/             # Recargas celulares
│   └── service-payments/             # Pagos de servicios
└── api/backend/[...path]/            # Proxy same-origin hacia el mock
```

### apps/web/src/features

Organiza el código por funcionalidad de negocio.

```text
features/
├── auth/                             # Login, schema y servicio de auth
├── account-dashboard/                # Cuenta, saldo y acciones rápidas
├── transfer-list/                    # Historial, filtros y detalle
├── transfer-create/                  # Creación y confirmación de transferencias
└── services/                         # Pagos, recargas y retiros demo
```

Dentro de cada feature:

- components: componentes visuales del módulo.
- pages: composición de la vista principal.
- services: llamadas al API o integración.
- schemas: validaciones con Zod.
- types: contratos TypeScript.
- helpers: funciones puras y utilidades.

### apps/web/src/components

```text
components/
├── auth/                             # Layout de autenticación
├── layout/                           # Header, navegación, footer y layout
└── ui/                               # Componentes reutilizables de interfaz
```

### apps/web/src/store

Estado global de autenticación, cuenta, movimientos y saldos.

```text
store/
├── authStore.ts                      # Sesión y usuario autenticado
├── accountStore.ts                   # Cuenta consultada actualmente
├── transferListStore.ts              # Fachada del estado de movimientos
└── transfer-list/
    ├── account-balance.slice.ts      # Carga y saldo base
    ├── transfer-mutation.slice.ts    # Débitos, créditos y movimientos locales
    ├── transfer-query.slice.ts       # Consulta y combinación del historial
    ├── transfer-list-store.helper.ts # Cálculos y deduplicación
    ├── transfer-list-store.state.ts  # Estado inicial
    ├── transfer-list-store.type.ts   # Tipos del store
    └── README.md                     # Reglas del modelo de saldo
```

El saldo disponible se calcula así:

```text
saldo disponible = saldo remoto base + ajustes locales
```

Los ajustes se derivan de los movimientos creados en el navegador. Los montos se normalizan como valores positivos; Debit resta y Credit suma.

### apps/web/src/services

```text
services/
├── api.ts                            # Cliente Axios y base URL del proxy
└── fetchApi.ts                       # Wrapper genérico para HTTP
```

### apps/web/src/data

Datos estáticos del entorno demo:

- Credenciales públicas del login.
- Cuenta demo.
- Menú principal.
- Facturas y datos de servicios.

### apps/web/src/helpers y apps/web/src/hooks

- helpers: filtros, fechas, formatos y reglas reutilizables.
- hooks: lógica React reutilizable, como el cálculo reactivo del saldo.

### apps/web/public

```text
public/assets/
├── fonts/                            # Fuentes de la interfaz
├── images/auth/                      # Logo del login
├── images/docs/                      # Capturas de esta documentación
└── images/lafise_logo.ico            # Favicon
```

## 7. Persistencia del estado

Zustand persiste información en localStorage:

- lafise-auth: sesión del usuario demo.
- lafise-account: cuenta consultada.
- lafise-transfer-list: movimientos locales, saldo base y ajustes.

La persistencia permite conservar operaciones simuladas al navegar o recargar. El store incluye migraciones para limpiar datos de versiones anteriores y mantener el saldo consistente.

## 8. Producción

### Frontend en Vercel

Configura la variable de entorno:

```env
API_URL=https://tu-backend.onrender.com
```

Debe apuntar al backend público, no al dominio de Vercel. El frontend accede al backend por /api/backend, por lo que el navegador no necesita una petición CORS directa.

### Mock API en Render o Railway

```text
Root Directory: apps/api
Build Command: npm ci
Start Command: npm start
```

El comando npm start utiliza automáticamente el puerto asignado mediante PORT.

## 9. Validación

Desde la raíz del proyecto:

```bash
yarn lint
yarn format:check
yarn build
```

## Galería de la aplicación

### Vistas de escritorio

<p align="center">
  <img src="apps/web/public/assets/images/docs/scrnli_34R6w0eSEywhxW.png" alt="Vista de escritorio de la aplicación" width="48%" />
  <img src="apps/web/public/assets/images/docs/scrnli_8ewGoK9LVZ3ScS.png" alt="Vista de escritorio de la aplicación" width="48%" />
</p>

<p align="center">
  <img src="apps/web/public/assets/images/docs/scrnli_QUs2JVDBgz1Vvl.png" alt="Vista de escritorio de la aplicación" width="48%" />
  <img src="apps/web/public/assets/images/docs/scrnli_RhgDmqcooZ4582.png" alt="Vista de escritorio de la aplicación" width="48%" />
</p>

<p align="center">
  <img src="apps/web/public/assets/images/docs/scrnli_Y96GNWBZ1Z3zRh.png" alt="Vista de escritorio de la aplicación" width="48%" />
  <img src="apps/web/public/assets/images/docs/scrnli_weXjcNSQJyZIF5.png" alt="Vista de escritorio de la aplicación" width="48%" />
</p>

### Vistas móviles

<p align="center">
  <img src="apps/web/public/assets/images/docs/scrnli_3s2pXhwfJZ2TUO.png" alt="Vista móvil de la aplicación" width="24%" />
  <img src="apps/web/public/assets/images/docs/scrnli_8CFY311e8yZT8p.png" alt="Vista móvil de la aplicación" width="24%" />
  <img src="apps/web/public/assets/images/docs/scrnli_FfWR4A6OXZ3HkJ.png" alt="Vista móvil de la aplicación" width="24%" />
  <img src="apps/web/public/assets/images/docs/scrnli_M6Km58770z24yT.png" alt="Vista móvil de la aplicación" width="24%" />
</p>

<p align="center">
  <img src="apps/web/public/assets/images/docs/scrnli_f33Jo05L3z2cgA.png" alt="Vista móvil de la aplicación" width="24%" />
  <img src="apps/web/public/assets/images/docs/scrnli_l8Ib26ppAz0SC9.png" alt="Vista móvil de la aplicación" width="24%" />
  <img src="apps/web/public/assets/images/docs/scrnli_qjODO6DOlZ3BCn.png" alt="Vista móvil de la aplicación" width="24%" />
</p>
Licencia y alcance
Este proyecto fue creado como una implementación demostrativa para una prueba técnica. El backend, las credenciales, los saldos y las transacciones son datos simulados. Este proyecto fue creado por: Nacxit Armando Mayorga Espinal
