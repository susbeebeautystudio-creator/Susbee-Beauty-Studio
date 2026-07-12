import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const whatsappUrl = 'https://wa.me/9779856103666?text=Hello%20Susbee%20Beauty%20Studio%2C%20I%20want%20to%20book%20an%20appointment.';

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white px-5 py-3.5 rounded-full shadow-lg flex items-center gap-2 font-bold hover:scale-105 hover:shadow-xl transition-all duration-300 animate-[bounce_2s_infinite]"
    >
      <MessageCircle className="h-5 w-5 fill-white" />
      <span className="text-sm font-sans tracking-wide">WhatsApp</span>
    </a>
  );
}
