import { PartyPopper } from "lucide-react";

export default function AnnouncementRibbon() {
  return (
    <div className="announcement-ribbon flex items-center justify-center gap-2 sm:gap-3 px-4">
      <PartyPopper className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
      <span className="text-xs sm:text-base md:text-lg text-center">
        ¡Ya abrimos! Visítanos en Av. La Compañía 01661, Rancagua
      </span>
      <PartyPopper className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
    </div>
  );
}
