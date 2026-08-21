"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { logout } from "@/lib/auth";

interface LogoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: () => void;
}

export function LogoutDialog({ open, onOpenChange, onConfirm }: LogoutDialogProps) {
  const router = useRouter();

  const handleLogout = () => {
    logout();
    onOpenChange(false);
    if (onConfirm) {
      onConfirm();
    } else {
      router.push("/login");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LogOut className="h-5 w-5 text-destructive" /> Logout
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">Are you sure you want to logout? You will be redirected to the login page.</p>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="destructive" onClick={handleLogout}>Logout</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
