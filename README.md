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
