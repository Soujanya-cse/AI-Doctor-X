import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// Now that we've confirmed basic rendering works, add back the main app
// with proper error boundaries
try {
  console.log("Mounting application");
  createRoot(document.getElementById("root")!).render(<App />);
  console.log("Application mounted successfully");
} catch (error) {
  console.error("Error rendering application:", error);
  
  // Fallback UI in case the app fails to render
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; background-color: #121C2E; color: white; min-height: 100vh; font-family: system-ui, sans-serif;">
        <h1 style="font-size: 24px; margin-bottom: 10px;">Doctor X - Error</h1>
        <p>The application failed to load. Please check the console for error details.</p>
        <pre style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 4px; overflow: auto; max-width: 100%;">${error instanceof Error ? error.message : 'Unknown error'}</pre>
      </div>
    `;
  }
}
