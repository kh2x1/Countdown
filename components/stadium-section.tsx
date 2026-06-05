import Image from 'next/image';
import { Building2, MapPin, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { Stadium } from '@/lib/types';

export function StadiumSection({ stadium }: { stadium: Stadium }) {
  return (
    <Card className="overflow-hidden bg-white/[0.03] backdrop-blur-xl">
      <div className="relative h-56 w-full sm:h-72">
        <Image
          src={stadium.image}
          alt={stadium.name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
        <div className="absolute bottom-4 left-5">
          <h3 className="text-2xl font-bold drop-shadow">{stadium.name}</h3>
          <p className="flex items-center gap-1.5 text-sm text-white/80">
            <MapPin className="h-4 w-4" />
            {stadium.city}, {stadium.country}
          </p>
        </div>
      </div>
      <CardContent className="grid grid-cols-2 gap-4 pt-5 sm:grid-cols-3">
        <Detail icon={<Building2 className="h-4 w-4" />} label="Stadium" value={stadium.name} />
        <Detail icon={<MapPin className="h-4 w-4" />} label="City" value={`${stadium.city}, ${stadium.country}`} />
        {stadium.capacity && (
          <Detail
            icon={<Users className="h-4 w-4" />}
            label="Capacity"
            value={stadium.capacity.toLocaleString()}
          />
        )}
      </CardContent>
    </Card>
  );
}

function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
      <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
