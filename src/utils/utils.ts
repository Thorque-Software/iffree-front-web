export const getTodayFormatted = (): string => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  // Obtener con Intl.DateTimeFormat en español de Argentina
  const formatter = new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Argentina/Buenos_Aires",
  });

  // Esto devuelve algo como "05/09/2025 08:00"
  const parts = formatter.formatToParts(date);

  const day = parts.find(p => p.type === "day")?.value;
  const month = parts.find(p => p.type === "month")?.value;
  const year = parts.find(p => p.type === "year")?.value;
  const hour = parts.find(p => p.type === "hour")?.value;
  const minute = parts.find(p => p.type === "minute")?.value;

  return `${day}/${month}/${year} ${hour}:${minute} hs`;
}

export const addOneDay = (dateStr: string): string => {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + 2);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}