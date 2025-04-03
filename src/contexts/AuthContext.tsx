import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

type UserRole = "admin" | "user";

interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: () => boolean;
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<boolean>;
  requestPasswordReset: (email: string) => Promise<boolean>;
  resetPassword: (resetToken: string, newPassword: string) => Promise<boolean>;
  registerUser: (
    name: string,
    email: string,
    password: string,
    role: UserRole,
  ) => Promise<boolean>;
  getAllUsers: () => StoredUser[];
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

// In a real app, these would be stored in a database
interface StoredUser extends User {
  password: string;
  contact?: string;
  resetToken?: string;
  resetTokenExpiry?: number;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load users from localStorage or use defaults
  const [users, setUsers] = useState<StoredUser[]>(() => {
    const storedUsers = localStorage.getItem("appUsers");
    if (storedUsers) {
      try {
        return JSON.parse(storedUsers);
      } catch (e) {
        console.error("Failed to parse stored users", e);
      }
    }

    // Default users if none in localStorage
    return [
      {
        id: "1",
        name: "Admin User",
        role: "admin",
        email: "admin@example.com",
        password: "1234", // In a real app, this would be hashed
      },
      {
        id: "2",
        name: "Regular User",
        role: "user",
        email: "user@example.com",
        password: "1234", // In a real app, this would be hashed
      },
    ];
  });

  // Save users to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("appUsers", JSON.stringify(users));
  }, [users]);

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem("currentUser");
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setError(null);

    // Find user with matching email and password
    const foundUser = users.find(
      (u) => u.email === email && u.password === password,
    );

    if (foundUser) {
      // Create a user object without the password
      const { password, resetToken, resetTokenExpiry, ...userWithoutPassword } =
        foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
      return true;
    } else {
      setError("Invalid email or password");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  const isAdmin = () => {
    return user?.role === "admin";
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
  ): Promise<boolean> => {
    setError(null);

    if (!user) {
      setError("You must be logged in to change your password");
      return false;
    }

    // Find the user in our "database"
    const userIndex = users.findIndex((u) => u.id === user.id);

    if (userIndex === -1) {
      setError("User not found");
      return false;
    }

    // Verify current password
    if (users[userIndex].password !== currentPassword) {
      setError("Current password is incorrect");
      return false;
    }

    // Update password
    const updatedUsers = [...users];
    updatedUsers[userIndex] = {
      ...updatedUsers[userIndex],
      password: newPassword,
    };

    setUsers(updatedUsers);
    return true;
  };

  const requestPasswordReset = async (email: string): Promise<boolean> => {
    setError(null);

    // Find user with matching email
    const userIndex = users.findIndex((u) => u.email === email);

    if (userIndex === -1) {
      // Don't reveal that the email doesn't exist for security reasons
      // Just pretend we sent the email
      return true;
    }

    // Generate a reset token (in a real app, this would be a secure random token)
    const resetToken = Math.random().toString(36).substring(2, 15);
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

    // Update user with reset token
    const updatedUsers = [...users];
    updatedUsers[userIndex] = {
      ...updatedUsers[userIndex],
      resetToken,
      resetTokenExpiry,
    };

    setUsers(updatedUsers);

    // In a real app, we would send an email with the reset token
    console.log(
      `Password reset requested for ${email}. Reset token: ${resetToken}`,
    );

    return true;
  };

  const resetPassword = async (
    resetToken: string,
    newPassword: string,
  ): Promise<boolean> => {
    setError(null);

    // Find user with matching reset token
    const userIndex = users.findIndex(
      (u) =>
        u.resetToken === resetToken &&
        u.resetTokenExpiry &&
        u.resetTokenExpiry > Date.now(),
    );

    if (userIndex === -1) {
      setError("Invalid or expired reset token");
      return false;
    }

    // Update password and clear reset token
    const updatedUsers = [...users];
    updatedUsers[userIndex] = {
      ...updatedUsers[userIndex],
      password: newPassword,
      resetToken: undefined,
      resetTokenExpiry: undefined,
    };

    setUsers(updatedUsers);
    return true;
  };

  const registerUser = async (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    contact?: string,
  ): Promise<boolean> => {
    setError(null);

    // Check if user with this email already exists
    if (users.some((u) => u.email === email)) {
      setError("A user with this email already exists");
      return false;
    }

    // Create new user
    const newUser: StoredUser = {
      id: Date.now().toString(), // Simple ID generation
      name,
      email,
      role,
      password,
      contact,
    };

    // Add to users array
    setUsers([...users, newUser]);
    return true;
  };

  const getAllUsers = (): StoredUser[] => {
    // Return users without passwords
    return users.map(
      ({ password, resetToken, resetTokenExpiry, ...user }) =>
        user as StoredUser,
    );
  };

  const value = {
    user,
    login,
    logout,
    isAdmin,
    changePassword,
    requestPasswordReset,
    resetPassword,
    registerUser,
    getAllUsers,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
