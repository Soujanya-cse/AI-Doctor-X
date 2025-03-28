import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";
import { Route, Switch } from "wouter";
import Home from "@/pages/Home";
import ARView from "@/pages/ARView";
import NotFound from "@/pages/not-found";
import { ModelProvider } from "@/context/ModelContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

function App() {
  // Apply custom styles to body
  useEffect(() => {
    // Add body background
    document.body.style.overflow = "auto";
    document.body.style.backgroundColor = "#121C2E";
    
    // Make sure to clean up when component unmounts
    return () => {
      document.body.style.overflow = "";
      document.body.style.backgroundColor = "";
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ModelProvider>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/ar" component={ARView} />
          <Route component={NotFound} />
        </Switch>
        <Toaster />
      </ModelProvider>
    </QueryClientProvider>
  );
}

export default App;
