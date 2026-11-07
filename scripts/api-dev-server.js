// Runs the Vercel-style handlers in /api locally inside Vite (no `vercel dev`,
// no Vercel login, nothing leaves this computer except the calls to Claude).
import path from "node:path";
import { existsSync } from "node:fs";

export function apiDevServer() {
  const mount = (server, load) => {
    server.middlewares.use(async (req, res, next) => {
      if (!req.url || !req.url.startsWith("/api/")) return next();
      const name = req.url.slice(5).split("?")[0].replace(/[^a-z-]/g, "");
      if (!name || name.startsWith("_") || !existsSync(path.resolve("api", name + ".ts"))) {
        res.statusCode = 404; res.setHeader("content-type", "application/json");
        return res.end(JSON.stringify({ error: "No such API route" }));
      }
      try {
        const mod = await load(name);
        let raw = "";
        for await (const c of req) { raw += c; if (raw.length > 30e6) break; }
        req.body = raw ? JSON.parse(raw) : {};
        res.status = (c) => { res.statusCode = c; return res; };
        res.json = (o) => { res.setHeader("content-type", "application/json"); res.end(JSON.stringify(o)); return res; };
        await mod.default(req, res);
      } catch (e) {
        console.error("[api]", name, e);
        res.statusCode = 500; res.setHeader("content-type", "application/json");
        res.end(JSON.stringify({ error: "Server error. Check the terminal." }));
      }
    });
  };
  return {
    name: "studyrot-api",
    configureServer(server) {
      mount(server, (name) => server.ssrLoadModule(path.resolve("api", name + ".ts")));
    },
    // `vite preview` (the built PWA) also gets the API, via a small TS loader
    async configurePreviewServer(server) {
      const { tsImport } = await import("tsx/esm/api");
      mount(server, (name) => tsImport(path.resolve("api", name + ".ts"), import.meta.url));
    },
  };
}
