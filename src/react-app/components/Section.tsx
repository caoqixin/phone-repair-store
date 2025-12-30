interface SectionProps {
  title: string;
  icon: any;
  children: React.ReactNode;
}

export const Section = ({ title, icon: Icon, children }: SectionProps) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-6">
    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
      <Icon className="size-5 text-primary-600" /> {title}
    </h3>
    {children}
  </div>
);
