import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import SectionHeading from "./SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ContactSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", phone: "", interest: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = form.name.trim();
    const trimmedPhone = form.phone.trim();

    if (!trimmedName || trimmedName.length > 100) {
      toast({ title: "Please enter a valid name", variant: "destructive" });
      return;
    }
    if (!/^[6-9]\d{9}$/.test(trimmedPhone)) {
      toast({ title: "Please enter a valid 10-digit phone number", variant: "destructive" });
      return;
    }
    if (!form.interest) {
      toast({ title: "Please select a service", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      toast({ title: "Thank you!", description: "We'll contact you shortly." });
      setForm({ name: "", phone: "", interest: "" });
      setSubmitting(false);
    }, 800);
  };

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4" ref={ref}>
        <SectionHeading title="Get In Touch" subtitle="Have questions? Reach out to us and we'll get back to you promptly." />

        <div className={`grid md:grid-cols-2 gap-10 max-w-5xl mx-auto transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="font-heading font-semibold text-foreground text-xl mb-6">Contact Information</h3>
              <div className="space-y-5">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Address</p>
                    <p className="text-muted-foreground text-sm">Near Taj Hospital, Jagdishpur,<br />West Champaran, Bihar - 845459</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Phone</p>
                    <a href="tel:7070422574" className="text-muted-foreground text-sm hover:text-secondary transition-colors">7070422574</a>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Email</p>
                    <a href="mailto:info@apsclasses.com" className="text-muted-foreground text-sm hover:text-secondary transition-colors">info@apsclasses.com</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps - Jagdishpur, West Champaran */}
            <div className="rounded-xl overflow-hidden border border-border shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14266.2!2d84.3933!3d26.73!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39935e5e5c02b80d%3A0x2b5e5f9a3c3b3b3b!2sJagdishpur%2C%20West%20Champaran%2C%20Bihar!5e0!3m2!1sen!2sin!4v1700000000000"
                width="100%"
                height="220"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="APS Classes Location - Jagdishpur, West Champaran"
              />
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="bg-card rounded-xl p-8 border border-border shadow-sm space-y-5">
            <h3 className="font-heading font-semibold text-foreground text-xl mb-2">Send us a Message</h3>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Your Name</label>
              <Input
                placeholder="Enter your name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                maxLength={100}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Phone Number</label>
              <Input
                placeholder="Enter 10-digit phone number"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
                type="tel"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Service Interest</label>
              <Select value={form.interest} onValueChange={(v) => setForm((f) => ({ ...f, interest: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="coaching">Coaching Classes</SelectItem>
                  <SelectItem value="admission">College Admission</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? "Sending..." : "Submit Inquiry"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
