import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu, GraduationCap, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Coaching", to: "/coaching" },
  { label: "Admission", to: "/admission" },
  { label: "Contact", to: "/contact" },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed left-0 right-0 z-[100] transition-all duration-300",
        "top-[30px]",
        "bg-primary backdrop-blur-md shadow-lg border-b border-primary-foreground/10"
      )}
    >
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md">
            <GraduationCap className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <span className={cn(
              "text-lg font-bold font-heading leading-tight block transition-colors",
              "text-primary-foreground"
            )}>APS Classes</span>
            <span className={cn(
              "text-xs transition-colors",
              "text-primary-foreground/60"
            )}>By Munna Sir</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "text-sm font-medium px-4 py-2 rounded-lg transition-all duration-300 relative group",
                  isActive
                    ? "bg-secondary text-secondary-foreground shadow-md"
                    : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                )}
              >
                {link.label}
                <span className={cn(
                  "absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-secondary rounded-full transition-all duration-300",
                  isActive ? "w-3/4" : "w-0 group-hover:w-1/2"
                )} />
              </Link>
            );
          })}
          <Button asChild size="sm" className="ml-3 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300">
            <Link to="/contact">Contact Us</Link>
          </Button>
          <Link
            to="/admin/gallery"
            className="ml-2 w-9 h-9 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center text-primary-foreground transition-all duration-300 hover:scale-110 active:scale-95"
            title="Admin Dashboard"
          >
            <LogIn className="w-4 h-4" />
          </Link>
        </nav>

        {/* Mobile nav */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className={cn(
              "hover:scale-110 active:scale-95 transition-all",
              "text-primary-foreground"
            )}>
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetTitle className="text-lg font-heading">APS Classes</SheetTitle>
            <nav className="flex flex-col gap-2 mt-8">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "text-base font-medium py-3 px-4 rounded-lg transition-all duration-300 active:scale-[0.97]",
                      isActive
                        ? "bg-secondary text-secondary-foreground shadow-sm"
                        : "text-foreground hover:bg-secondary/10 hover:text-secondary hover:pl-6"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Button asChild className="mt-4">
                <Link to="/contact" onClick={() => setOpen(false)}>Contact Us</Link>
              </Button>
              <Link
                to="/admin/gallery"
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center gap-2 text-sm font-medium py-3 px-4 rounded-lg text-foreground hover:bg-secondary/10 hover:text-secondary transition-all"
              >
                <LogIn className="w-4 h-4" />
                Admin Dashboard
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
