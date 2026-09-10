# LAFISE Challenge

Monorepo para la prueba técnica de banca digital.

## Estructura

```text
apps/
├── api/    # Mock backend oficial
└── web/    # Aplicación Next.js
```

## Desarrollo

Instala las dependencias del frontend desde la raíz:

```bash
yarn install
```

Instala las dependencias del mock con npm:

```bash
npm install --prefix apps/api
```

Luego levanta el backend y el frontend con:

```bash
yarn dev
```

También puedes levantarlos por separado:

```bash
yarn dev:api
yarn dev:web
```

## Validación

```bash
yarn lint
yarn build
```

## Variables de entorno

En producción, `apps/web` requiere la URL pública del mock. La variable se usa
únicamente en el servidor de Next.js para evitar problemas de CORS en el navegador:

```env
API_URL=https://tu-api.onrender.com
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
