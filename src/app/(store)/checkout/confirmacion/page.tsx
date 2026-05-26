import Link from "next/link";
import { CheckCircle, ShoppingBag, MessageCircle } from "lucide-react";

interface Props {
  searchParams: { pedido?: string };
}

export const metadata = { title: "Pedido Confirmado" };

export default function ConfirmacionPage({ searchParams }: Props) {
  const orderNumber = searchParams.pedido || "---";

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-20 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-green-500" />
      </div>

      <h1 className="text-3xl font-black text-text-title mb-3">¡Pedido Confirmado!</h1>
      <p className="text-gray-500 mb-2">Tu pedido ha sido recibido exitosamente.</p>

      <div className="bg-gray-50 rounded-2xl p-6 my-8">
        <p className="text-sm text-gray-500 mb-1">Número de pedido</p>
        <p className="text-2xl font-black gradient-text">{orderNumber}</p>
      </div>

      <p className="text-gray-500 text-sm mb-8">
        Te enviaremos la confirmación y seguimiento a tu correo electrónico. Si tienes dudas, contáctanos por WhatsApp.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/tienda" className="btn-gradient">
          <ShoppingBag className="w-4 h-4" />
          Seguir Comprando
        </Link>
        <a
          href={`https://wa.me/56994055489?text=Hola%2C%20quiero%20consultar%20por%20mi%20pedido%20${orderNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gradient-outline"
        >
          <MessageCircle className="w-4 h-4" />
          Contactar
        </a>
      </div>
    </div>
  );
}
