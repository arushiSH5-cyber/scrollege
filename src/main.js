import "./globals.js";
import "./app.js";
import { registerSW } from "virtual:pwa-register";
registerSW({ immediate: true });
