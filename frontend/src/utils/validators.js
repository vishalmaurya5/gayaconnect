export const isEmail = (value = '') => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
export const isStrongPassword = (value = '') => value.length >= 6;
