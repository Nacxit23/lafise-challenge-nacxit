//Tiempo de expiración del token en milisegundos
export const getExpiresAt = (expiresIn: number) => Date.now() + expiresIn * 1000;
