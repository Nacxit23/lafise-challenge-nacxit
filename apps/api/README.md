# Mobile frontend challenge mock

Este repositorio contiene un Rest API mock para el desarrollo de la prueba técnica de frontend móvil "Aplicación para transferencias".

## Requisitos

- `nodejs`

Este mock mantiene su propia configuración de npm y su propio
`package-lock.json`, independiente del workspace Yarn del frontend.

## Instrucciones

✨ Ejecuta `npm run dev`, para ejecutar el proceso del mock (`localhost:5566`) y del Swagger de APIDOCS (`localhost:5567`).

Para ejecutar el mock de manera individual utiliza `npm run start-mock`. Esto iniciará el proceso de mock en `localhost:5566`.

Si deseas ver la documentación de la api de manera individual, ejecuta `npm run start-apidocs`. Esto levantará un sitio de swagger UI en `localhost:5567`.

Desde la raíz del monorepo también puedes ejecutar:

```bash
yarn dev:api
```
