import { Settings } from "../types";

export interface AboutData {
  settings: Settings;
}

export async function aboutLoader(): Promise<AboutData> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  try {
    const [settingsRes] = await Promise.all([fetch(`${baseUrl}/settings`)]);

    const [settingsData] = await Promise.all([settingsRes.json()]);

    return {
      settings: settingsData.success ? settingsData.data : {},
    };
  } catch (error) {
    console.error("About loader failed:", error);
    return { settings: {} };
  }
}
