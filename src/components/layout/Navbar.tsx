import { Link, useLocation } from "react-router-dom";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Flame, Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/roast", label: "Get Roasted" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-background border-b-4 border-foreground sticky top-0 z-50">
      <div className="section-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Flame className="h-8 w-8 text-primary fill-primary" />
            <span className="hidden sm:inline">RoastMyStartup</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 font-bold transition-colors ${
                  location.pathname === link.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-2 border-4 border-foreground bg-muted">
                  {user?.picture ? (
                    <img 
                      src={user.picture} 
                      alt={user.name} 
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                  <span className="font-bold text-sm">{user?.name}</span>
                </div>
                <BrutalButton
                  onClick={logout}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </BrutalButton>
              </div>
            ) : (
              <Link to="/signin">
                <BrutalButton variant="outline" size="sm">
                  Sign In
                </BrutalButton>
              </Link>
            )}
            <Link to="/roast">
              <BrutalButton size="sm">
                ROAST ME 🔥
              </BrutalButton>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 border-4 border-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-4 border-foreground bg-background">
          <div className="flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-4 font-bold border-b-4 border-foreground ${
                  location.pathname === link.href
                    ? "bg-primary text-primary-foreground"
                    : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="p-4 space-y-2">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 p-3 border-4 border-foreground bg-muted mb-2">
                    {user?.picture ? (
                      <img 
                        src={user.picture} 
                        alt={user.name} 
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                    <span className="font-bold text-sm">{user?.name}</span>
                  </div>
                  <BrutalButton
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </BrutalButton>
                </>
              ) : (
                <Link to="/signin" onClick={() => setMobileMenuOpen(false)}>
                  <BrutalButton variant="outline" className="w-full">
                    Sign In
                  </BrutalButton>
                </Link>
              )}
              <Link to="/roast" onClick={() => setMobileMenuOpen(false)}>
                <BrutalButton className="w-full">
                  ROAST ME 🔥
                </BrutalButton>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
