# `transferListStore`

Este store centraliza los movimientos y saldos utilizados por transferencias,
retiros, recargas y pagos de servicios. Su API pública se mantiene en
`src/store/transferListStore.ts` y su estado se persiste bajo la clave
`lafise-transfer-list`.

## Modelo de saldo

El saldo disponible no se almacena como un valor independiente. Se calcula así:

```text
saldo disponible = saldo base remoto + ajustes locales acumulados
```

- `baseBalancesByAccount`: último saldo obtenido mediante `GET /accounts/{id}`.
- `balanceAdjustmentsByAccount`: suma de movimientos creados en el navegador.
- `getAvailableBalance(accountId)`: devuelve el resultado o `null` cuando todavía
  no se ha consultado el saldo base.

Esta separación evita contar dos veces las transacciones que el endpoint ya
incluya en su saldo remoto.

## Movimientos

- `createdTransfersByAccount` conserva los movimientos creados localmente por
  cada número de cuenta.
- `transfers` contiene únicamente la lista preparada para la cuenta actualmente
  seleccionada.
- Los movimientos locales tienen prioridad al combinarse con la respuesta del
  endpoint. `transactionNumber` se utiliza para eliminar duplicados.
- `addTransfer` registra un `Debit` en el origen. Si el destino pertenece a los
  productos conocidos, también registra un `Credit` y aumenta su ajuste.

## Ingresos automáticos del demo

`lastDemoIncomeAtByAccount` mantiene un temporizador independiente por cuenta.
`addDemoIncome` registra el crédito y actualiza el ajuste de saldo. Esta lógica es
exclusiva de la demostración web y no emite notificaciones.

## Organización

- `transfer-query.slice.ts`: consulta y combinación del historial.
- `account-balance.slice.ts`: carga y cálculo de saldos.
- `transfer-mutation.slice.ts`: débito y crédito de transferencias.
- `demo-income.slice.ts`: créditos automáticos demostrativos.
- `transfer-list-store.helper.ts`: funciones puras para combinar y transformar.
- `transfer-list-store.state.ts`: estado inicial reutilizable.
- `transfer-list-store.type.ts`: contrato público documentado.

Los componentes deben importar siempre `@/store/transferListStore`; los slices
son detalles internos y no deben consumirse directamente.
