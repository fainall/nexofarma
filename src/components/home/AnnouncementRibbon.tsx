import { MapPin } from "lucide-react";

export default function AnnouncementRibbon() {
  return (
    <div className="announcement-ribbon flex items-center justify-center gap-2 sm:gap-3 px-4">
      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
      <span className="text-xs sm:text-base md:text-lg text-center">
        ¡Próxima apertura en Av. la Compañía 01661, Rancagua!
      </span>
    </div>
  );
}
