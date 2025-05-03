"use client";

import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <Button
      onClick={handleLogout}
      className="gartic-button"
      variant="destructive"
    >
      Sair
    </Button>
  );
}
