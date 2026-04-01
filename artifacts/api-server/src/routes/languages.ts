import { Router, type IRouter } from "express";
import { ListLanguagesResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const SUPPORTED_LANGUAGES = [
  { code: "sq", name: "Albanian", nativeName: "Shqip", flagEmoji: "🇦🇱" },
  { code: "en", name: "English", nativeName: "English", flagEmoji: "🇺🇸" },
  { code: "es", name: "Spanish", nativeName: "Español", flagEmoji: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", flagEmoji: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flagEmoji: "🇩🇪" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flagEmoji: "🇧🇷" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flagEmoji: "🇸🇦" },
  { code: "zh", name: "Chinese", nativeName: "中文", flagEmoji: "🇨🇳" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flagEmoji: "🇯🇵" },
  { code: "ko", name: "Korean", nativeName: "한국어", flagEmoji: "🇰🇷" },
  { code: "it", name: "Italian", nativeName: "Italiano", flagEmoji: "🇮🇹" },
  { code: "ru", name: "Russian", nativeName: "Русский", flagEmoji: "🇷🇺" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flagEmoji: "🇹🇷" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flagEmoji: "🇮🇳" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", flagEmoji: "🇳🇱" },
  { code: "pl", name: "Polish", nativeName: "Polski", flagEmoji: "🇵🇱" },
];

router.get("/languages", async (_req, res): Promise<void> => {
  res.json(ListLanguagesResponse.parse(SUPPORTED_LANGUAGES));
});

export default router;
