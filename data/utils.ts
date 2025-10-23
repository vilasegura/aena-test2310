// --- Date Generation Helpers ---
export const generateRecentDate = (daysAgo: number, hoursAgo: number = 0, minutesAgo: number = 0): Date => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(date.getHours() - hoursAgo);
    date.setMinutes(date.getMinutes() - minutesAgo);
    // Add some randomness to minutes
    date.setMinutes(date.getMinutes() - Math.floor(Math.random() * 59));
    return date;
};

export const toYMD_HM = (date: Date): string => {
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const toISODate = (date: Date): string => date.toISOString().split('T')[0];
export const toISODateTime = (date: Date): string => date.toISOString();
