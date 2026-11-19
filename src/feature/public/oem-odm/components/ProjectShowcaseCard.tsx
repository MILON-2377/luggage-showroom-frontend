import { ShoppingBag } from "lucide-react";

export default function ProjectShowcaseCard({
  title,
  description,
  label,
  color,
}: {
  title: string;
  description: string;
  label: string;
  color: string;
}) {
  return (
    <article className="group overflow-hidden rounded-t-[140px] rounded-b-[26px] border border-white bg-white shadow-[6px_8px_0_#dacfb9,0_25px_40px_-30px_#0008]">
      <div
        aria-hidden="true"
        className="relative flex h-72 items-center justify-center overflow-hidden bg-gradient-to-br from-[#e9e1d3] to-[#f7f4ec] [perspective:700px]"
      >
        <div className="absolute size-48 rounded-full border border-accent/20 [transform:rotateX(55deg)]" />
        <div className="absolute bottom-12 h-6 w-36 rounded-full bg-black/20 blur-xl" />
        <div
          style={{ backgroundColor: color }}
          className="relative flex h-36 w-40 items-center justify-center rounded-[26px] border border-white/30 text-white/80 shadow-[10px_10px_0_#7e6a4a,20px_30px_30px_-15px_#0006,inset_2px_2px_3px_#fff5] transition-transform duration-500 [transform:rotateY(-22deg)_rotateZ(-8deg)] motion-safe:group-hover:[transform:rotateY(12deg)_rotateZ(4deg)]"
        >
          <div className="absolute -top-10 h-14 w-20 rounded-t-full border-[9px] border-current" />
          <ShoppingBag className="size-12" strokeWidth={1} />
        </div>
      </div>
      <div className="p-7">
        <p className="text-sm text-accent">{label}</p>
        <h3 className="mt-3 font-serif text-3xl">{title}</h3>
        <p className="mt-4 text-base leading-7 text-secondary">{description}</p>
      </div>
    </article>
  );
}