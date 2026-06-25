import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";

/**
 * Pathless layout for the authenticated app. Every screen nested under
 * `src/routes/_app/` renders inside the persistent nav + pancake-flip shell.
 */
export const Route = createFileRoute("/_app")({
  component: AppShell,
});
