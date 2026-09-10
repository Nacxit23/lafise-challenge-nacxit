/**
 * Genera un código local para el retiro sin tarjeta.
 *
 * DEMO: este código solo simula una autorización de retiro en la web y no
 * representa una clave bancaria real ni se envía a un cajero automático.
 */
const generateCashWithdrawalCode = () => String(Math.floor(100_000 + Math.random() * 900_000));

export { generateCashWithdrawalCode };
