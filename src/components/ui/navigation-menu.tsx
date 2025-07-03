// NavigationMenu.tsx
import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { LogInIcon } from "lucide-react";
import { TextField } from "@mui/material";
import { Link } from "react-router-dom";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export function NavigationMenu() {
  const [language, setLanguage] = React.useState("English");

  return (
    <div className="bg-white w-full shadow-md fixed top-0 left-0 z-50">
      <NavigationMenuPrimitive.Root className="flex justify-between items-center px-8 py-4 max-w-screen-xl mx-auto">
        <Link to="/" className="text-2xl font-bold text-blue-700">
          Padel Courts
        </Link>

        <NavigationMenuPrimitive.List className="flex gap-6 items-center">
          {[
            { label: "Home", to: "/" },
            { label: "Courts", to: "/courts" },
            { label: "Booking", to: "/booking" },
          ].map((item) => (
            <NavigationMenuPrimitive.Item key={item.to}>
              <NavigationMenuPrimitive.Link asChild>
                <Link
                  to={item.to}
                  className="text-gray-700 font-medium hover:text-blue-700 transition px-3 py-1"
                >
                  {item.label}
                </Link>
              </NavigationMenuPrimitive.Link>
            </NavigationMenuPrimitive.Item>
          ))}
        </NavigationMenuPrimitive.List>

        <div className="flex items-center gap-4">
          <TextField
            size="small"
            placeholder="Search courts"
            variant="outlined"
            sx={{ minWidth: 200 }}
          />

          <DropdownMenuPrimitive.Root>
            <DropdownMenuPrimitive.Trigger asChild>
              <button className="text-sm px-4 py-2 border rounded bg-white text-gray-700 hover:bg-gray-100 transition">
                {language}
              </button>
            </DropdownMenuPrimitive.Trigger>
            <DropdownMenuPrimitive.Portal>
              <DropdownMenuPrimitive.Content
                sideOffset={4}
                className="z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 text-sm shadow-md"
              >
                {[
                  "English",
                  "Urdu"
                ].map((lang) => (
                  <DropdownMenuPrimitive.Item
                    key={lang}
                    onSelect={() => setLanguage(lang)}
                    className="px-3 py-2 rounded-sm cursor-pointer hover:bg-gray-100"
                  >
                    {lang}
                  </DropdownMenuPrimitive.Item>
                ))}
              </DropdownMenuPrimitive.Content>
            </DropdownMenuPrimitive.Portal>
          </DropdownMenuPrimitive.Root>

          <Link
            to="/login"
            className="flex items-center gap-2 text-sm bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition shadow"
          >
            <LogInIcon className="w-4 h-4" />
            Login
          </Link>
        </div>
      </NavigationMenuPrimitive.Root>
    </div>
  );
}