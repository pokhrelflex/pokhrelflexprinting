import { createContext } from "react";

// logoReady === false  → the intro is still running; the header logo stays hidden.
// logoReady === true   → the intro logo has landed; reveal the real header logo.
// Default true so the header renders normally if used outside the provider.
export const IntroContext = createContext({ logoReady: true });
