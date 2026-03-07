import { createContext, useContext } from "react";

// Single context used by all components
export const AppCtx = createContext(null);
export const useApp = () => useContext(AppCtx);