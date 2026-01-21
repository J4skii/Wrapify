import { Link, useLocation } from "wouter";
import { useUser, useLogout } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut, User as UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
  const { data: user } = useUser();
  const logout = useLogout();
  const [location] = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center group-hover:animate-pulse">
            <span className="font-bold text-black text-sm">W</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-green-400 transition-colors">
            Wrapify
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-9 w-9 border border-white/10">
                    <AvatarImage src={user.photoUrl || undefined} alt={user.displayName || "User"} />
                    <AvatarFallback className="bg-green-600 text-white">
                      <UserIcon className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-[#181818] border-white/10 text-white" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {user.displayName && <p className="font-medium">{user.displayName}</p>}
                    {user.email && (
                      <p className="w-[200px] truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    )}
                  </div>
                </div>
                <DropdownMenuItem
                  className="text-red-400 focus:text-red-400 focus:bg-red-900/20 cursor-pointer"
                  onClick={() => logout.mutate()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            location !== "/" && (
              <Button 
                variant="ghost" 
                className="text-white hover:text-green-400"
                onClick={() => window.location.href = api.auth.login.path}
              >
                Login
              </Button>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
