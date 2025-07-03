import { Routes, Route } from "react-router-dom";
import { NavigationMenu } from "@/components/ui/navigation-menu"; // Your navbar
import Home from "./pages/Home"; // Create a Home.tsx inside /pages
import Booking from "./pages/Booking"; // New file
import Courts from "./pages/Courts"; // New file

function App() {
  return (
    <>
      <NavigationMenu /> {/* Always visible */}
      <div className="pt-[80px]"> {/* space for fixed navbar */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/courts" element={<Courts />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
