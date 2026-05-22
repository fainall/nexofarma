import { MapPin, Clock, Navigation } from "lucide-react";

export default function LocationSection() {
  return (
    <section className="py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl shadow-glass-lg overflow-hidden border border-gray-100 flex flex-col lg:flex-row">
          <div className="lg:w-1/2 min-h-[250px] sm:min-h-[350px] relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d105260.40798131375!2d-70.83549219356394!3d-34.17066914561007!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9663433eec143891%3A0xc60c1d636b04887!2sRancagua%2C%20O&#39;Higgins!5e0!3m2!1ses-419!2scl"
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación NexoFarma"
            />
          </div>
          <div className="lg:w-1/2 p-6 sm:p-8 md:p-12 flex flex-col justify-center">
            <h3 className="text-2xl sm:text-3xl font-black text-corp-cian uppercase tracking-tight mb-6 sm:mb-8">
              Visítanos en<br />Rancagua
            </h3>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-11 h-11 bg-corp-verde/10 rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-corp-cian" />
                </div>
                <div>
                  <h5 className="font-bold text-sm uppercase text-text-title mb-1">Dirección</h5>
                  <p className="text-sm text-gray-500">Av. La Compañía 01661<br />Rancagua, Región de O&apos;Higgins</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-11 h-11 bg-corp-verde/10 rounded-full flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-corp-cian" />
                </div>
                <div>
                  <h5 className="font-bold text-sm uppercase text-text-title mb-1">Horarios</h5>
                  <p className="text-sm text-gray-500">Lun - Sáb: 09:00 - 21:00 hrs.<br />Dom y Festivos: 10:00 - 20:00 hrs.</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <a
                href="https://maps.google.com/?q=Avenida+la+Compa%C3%B1%C3%ADa+01661,+Rancagua"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 font-bold text-sm rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300"
              >
                <Navigation className="w-4 h-4" />
                Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
