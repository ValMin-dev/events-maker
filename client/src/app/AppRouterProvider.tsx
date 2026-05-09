import { Suspense, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { appRouter } from "./router";
import { ensureAuthBootstrap } from "./auth-bootstrap";
export const AppRouterProvider = () => {
  useEffect(() => {
    void ensureAuthBootstrap();
  }, []);

  return (
    <Suspense
      fallback={
        <div className="grid min-h-svh place-items-center text-sm text-muted-foreground">
          LOADING
        </div>
      }
    >
      <RouterProvider router={appRouter} />
    </Suspense>
  );
};
