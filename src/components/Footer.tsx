import { Link } from "react-router-dom";
import { GraduationCap, Phone, Mail, MapPin, PhoneCall, Facebook, Instagram, Linkedin } from "lucide-react";

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
              <div className="flex flex-col gap-1">
                <a href="tel:7903627361" className="hover:text-secondary transition-colors">7903627361</a>
                <a href="tel:9798302129" className="hover:text-secondary transition-colors">9798302129</a>
              </div>
            </li>
            <li className="flex gap-2 items-center">
              <Mail className="w-4 h-4 shrink-0 text-secondary" />
              <a href="mailto:munnakumar7903627361@gmail.com" className="hover:text-secondary transition-colors">munnakumar7903627361@gmail.com</a>
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

    <div className="border-t border-primary-foreground/10 bg-primary/95">
      <div className="container mx-auto px-4 py-4 flex flex-col items-center justify-center gap-3 text-center">
        <p className="text-sm md:text-base font-bold text-primary-foreground bg-primary-foreground/10 border border-primary-foreground/25 rounded-full px-4 py-1.5 w-fit shadow-[0_0_14px_rgba(255,255,255,0.18)]">
          Designed By Sandeep Kumar (Software Engineer)
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 text-sm md:text-base font-bold">
          <a
            href="tel:7070422574"
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <PhoneCall className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.8} />
            7070422574
          </a>

          <a
            href="https://www.facebook.com/sandeep.kalwar.90"
            target="_blank"
            rel="noreferrer"
            aria-label="Developer Facebook"
            className="inline-flex items-center text-[#1877F2] hover:opacity-85 transition-opacity"
          >
            <Facebook className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.8} />
          </a>

          <a
            href="https://www.instagram.com/mr_sandeep2_/"
            target="_blank"
            rel="noreferrer"
            aria-label="Developer Instagram"
            className="inline-flex items-center text-[#E4405F] hover:opacity-85 transition-opacity"
          >
            <Instagram className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.8} />
          </a>

          <a
            href="https://www.linkedin.com/in/sandeepk-cse/"
            target="_blank"
            rel="noreferrer"
            aria-label="Developer LinkedIn"
            className="inline-flex items-center text-[#0A66C2] hover:opacity-85 transition-opacity"
          >
            <Linkedin className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.8} />
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
