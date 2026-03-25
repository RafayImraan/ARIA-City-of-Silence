import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { applyAction, getRoomState, touchPresence } from "./api/_lib/pollStore.mjs";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function sendJson(response: import("node:http").ServerResponse, status: number, payload: unknown) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json");
  response.setHeader("Cache-Control", "no-store");
  response.end(JSON.stringify(payload));
}

const devPollApiPlugin = {
  name: "dev-poll-api",
  apply: "serve" as const,
  configureServer(server: import("vite").ViteDevServer) {
    server.middlewares.use("/api/poll/state", async (request, response) => {
      try {
        const url = new URL(request.originalUrl || request.url || "/", "http://localhost");
        const roomId = url.searchParams.get("room") || "demo";
        const role = url.searchParams.get("role") === "host" ? "host" : "audience";
        const clientId = url.searchParams.get("clientId");
        const state = await getRoomState(roomId, role, clientId);
        sendJson(response, 200, state);
      } catch (error) {
        sendJson(response, 500, { error: error instanceof Error ? error.message : "State error." });
      }
    });

    server.middlewares.use("/api/poll/action", async (request, response) => {
      if (request.method !== "POST") {
        sendJson(response, 405, { error: "Method not allowed." });
        return;
      }

      let body = "";
      request.on("data", (chunk) => {
        body += chunk;
      });

      request.on("end", async () => {
        try {
          const action = body ? JSON.parse(body) : {};
          const roomId = action.roomId || "demo";
          const role = action.role === "host" ? "host" : "audience";
          const clientId = action.clientId || null;

          await touchPresence(roomId, role, clientId);
          const state = await applyAction(roomId, action);
          sendJson(response, 200, state);
        } catch (error) {
          sendJson(response, 500, { error: error instanceof Error ? error.message : "Action error." });
        }
      });
    });
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile(), devPollApiPlugin],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
