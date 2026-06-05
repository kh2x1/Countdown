import Image from 'next/image';
import { MapPin, Users } from 'lucide-react';
import { STADIUMS } from '@/lib/seed-data';

/** Grid of the 16 official host venues. */
export function StadiumsShowcase() {
  return (
    <section id="stadiums" className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Host Stadiums</h2>
        <p className="text-sm text-muted-foreground">
          16 iconic venues across the United States, Canada and Mexico.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {STADIUMS.map((s) => (
          <div
            key={s.id}
            className="group relative overflow-hidden rounded-xl border border-white/10"
          >
            <div className="relative h-40 w-full">
              <Image
                src={s.image}
                alt={s.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <h3 className="text-sm font-bold leading-tight drop-shadow">{s.name}</h3>
              <p className="mt-0.5 flex items-center gap-1 text-[11px] text-white/80">
                <MapPin className="h-3 w-3" />
                {s.city}, {s.country}
              </p>
              {s.capacity && (
                <p className="mt-0.5 flex items-center gap-1 text-[11px] text-white/70">
                  <Users className="h-3 w-3" />
                  {s.capacity.toLocaleString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
