import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { Shield, User } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UserLogin = () => {
  const { user, login, logout } = useAuth();

  const loginAsAdmin = () => {
    login({
      id: "1",
      name: "Admin User",
      role: "admin",
    });
  };

  const loginAsRegularUser = () => {
    login({
      id: "2",
      name: "Regular User",
      role: "user",
    });
  };

  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              {user.role === "admin" ? (
                <Shield className="h-4 w-4" />
              ) : (
                <User className="h-4 w-4" />
              )}
              {user.name}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Logged in as {user.name}</DropdownMenuLabel>
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Role: {user.role === "admin" ? "Administrator" : "Regular User"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex gap-2">
          <Button onClick={loginAsRegularUser} variant="outline" size="sm">
            <User className="h-4 w-4 mr-2" />
            Login as User
          </Button>
          <Button onClick={loginAsAdmin} variant="outline" size="sm">
            <Shield className="h-4 w-4 mr-2" />
            Login as Admin
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserLogin;
