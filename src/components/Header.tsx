import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu, GraduationCap, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Results", href: "/#results" },
  { label: "About", to: "/about" },
  { label: "Coaching", to: "/coaching" },
  { label: "Admission", to: "/admission" },
  { label: "Contact", to: "/contact" },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header
      className={cn(
        "fixed left-0 right-0 z-[140] transition-all duration-300",
        "top-[34px]",
        "translate-y-0 opacity-100 pointer-events-auto",
        "bg-primary backdrop-blur-md shadow-lg border-b border-primary-foreground/10"
      )}
    >
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        <Link to="/" className="flex items-center gap-2 group min-w-0 flex-1 md:flex-none">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md shrink-0">
            <GraduationCap className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <span className={cn(
              "text-lg font-bold font-heading leading-tight block transition-colors truncate",
              "text-primary-foreground"
            )}>APS Classes</span>
            <span className={cn(
              "text-xs transition-colors truncate block",
              "text-primary-foreground/60"
            )}>By Munna Sir</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isRouteLink = "to" in link;
            const isActive = isRouteLink ? location.pathname === link.to : false;

            const classes = cn(
              "text-sm font-medium px-4 py-2 rounded-lg transition-all duration-300 relative group",
              isActive
                ? "bg-secondary text-secondary-foreground shadow-md"
                : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
            );

            if (isRouteLink) {
              return (
                <Link key={link.to} to={link.to} className={classes}>
                  {link.label}
                  <span className={cn(
                    "absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-secondary rounded-full transition-all duration-300",
                    isActive ? "w-3/4" : "w-0 group-hover:w-1/2"
                  )} />
                </Link>
              );
            }

            return (
              <a key={link.href} href={link.href} className={classes}>
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-secondary rounded-full transition-all duration-300 w-0 group-hover:w-1/2" />
              </a>
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
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className={cn(
              "md:hidden shrink-0 ml-2 hover:scale-110 active:scale-95 transition-all",
              "text-primary-foreground"
            )}>
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetTitle className="text-lg font-heading">APS Classes</SheetTitle>
            <nav className="flex flex-col gap-2 mt-8">
              {navLinks.map((link) => {
                const isRouteLink = "to" in link;
                const isActive = isRouteLink ? location.pathname === link.to : false;

                const classes = cn(
                  "text-base font-medium py-3 px-4 rounded-lg transition-all duration-300 active:scale-[0.97]",
                  isActive
                    ? "bg-secondary text-secondary-foreground shadow-sm"
                    : "text-foreground hover:bg-secondary/10 hover:text-secondary hover:pl-6"
                );

                if (isRouteLink) {
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setOpen(false)}
                      className={classes}
                    >
                      {link.label}
                    </Link>
                  );
                }

                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={classes}
                  >
                    {link.label}
                  </a>
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
