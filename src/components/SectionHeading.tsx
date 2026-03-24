interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  light?: boolean;
}

const SectionHeading = ({ title, subtitle, light }: SectionHeadingProps) => (
  <div className="text-center mb-12">
    <h2 className={`text-3xl md:text-4xl font-bold mb-3 ${light ? "text-primary-foreground" : "text-foreground"}`}>
      {title}
    </h2>
    {subtitle && (
      <p className={`text-lg max-w-2xl mx-auto ${light ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
        {subtitle}
      </p>
    )}
    <div className={`w-20 h-1 mx-auto mt-4 rounded-full ${light ? "bg-primary-foreground/50" : "bg-secondary"}`} />
  </div>
);

export default SectionHeading;
