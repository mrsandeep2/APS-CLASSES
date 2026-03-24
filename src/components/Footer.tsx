import { Link } from "react-router-dom";
import { GraduationCap, Phone, Mail, MapPin } from "lucide-react";

const Footer = () => (
  <footer className="bg-primary text-primary-foreground">
    <div className="container mx-auto px-4 py-14">
      <div className="grid md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-lg bg-primary-foreground/10 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <span className="font-heading font-bold text-lg block leading-tight">APS Classes</span>
              <span className="text-xs text-primary-foreground/60">By Munna Sir</span>
            </div>
          </div>
          <p className="text-primary-foreground/70 text-sm leading-relaxed">
            Quality coaching for Nursery to 12th and expert college admission guidance for a brighter future.
          </p>
        </div>

        <div>
          <h4 className="font-heading font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            {[
              { label: "Home", to: "/" },
              { label: "About", to: "/about" },
              { label: "Coaching", to: "/coaching" },
              { label: "Admission", to: "/admission" },
              { label: "Contact", to: "/contact" },
            ].map((link) => (
              <li key={link.label}>
                <Link to={link.to} className="text-primary-foreground/70 text-sm hover:text-secondary transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-semibold mb-4">Contact Us</h4>
          <ul className="space-y-3 text-sm text-primary-foreground/70">
            <li className="flex gap-2 items-start">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-secondary" />
              Near Taj Hospital, Jagdishpur, West Champaran, Bihar - 845459
            </li>
            <li className="flex gap-2 items-center">
              <Phone className="w-4 h-4 shrink-0 text-secondary" />
              <a href="tel:7070422574" className="hover:text-secondary transition-colors">7070422574</a>
            </li>
            <li className="flex gap-2 items-center">
              <Mail className="w-4 h-4 shrink-0 text-secondary" />
              <a href="mailto:info@apsclasses.com" className="hover:text-secondary transition-colors">info@apsclasses.com</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div className="border-t border-primary-foreground/10">
      <div className="container mx-auto px-4 py-5 text-center text-primary-foreground/50 text-sm">
        © {new Date().getFullYear()} APS Classes. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
