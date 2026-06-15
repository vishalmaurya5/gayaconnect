export const currency = (value = 0) => `?${Number(value).toLocaleString('en-IN')}`;
export const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
