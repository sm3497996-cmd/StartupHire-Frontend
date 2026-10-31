import { BLANK_TEMPLATES } from "../constants/resume";

export const makeBlank = (section) => ({
    ...BLANK_TEMPLATES[section],
    id: `${Date.now()}${Math.floor(Math.random() * 1000)}`,
});

export const hasText = (o, keys) =>
    keys.some((k) => String(o[k] || "").trim());
