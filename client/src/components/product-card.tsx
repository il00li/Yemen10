import { Product } from "@shared/schema";
import { GlassButton } from "./glass-button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();

  // Get WhatsApp number from settings
  const { data: whatsappSetting } = useQuery({
    queryKey: ["/api/settings/whatsapp_number"]
  });

  const formatPrice = (price: number) => {
    return `${(price / 100).toFixed(0)} ريال`;
  };

  const handleOrderNow = () => {
    const whatsappNumber = whatsappSetting?.value || "+966501234567";
    
    const message = `مرحباً، أريد طلب المنتج التالي:\n\n` +
                    `اسم المنتج: ${product.name}\n` +
                    `السعر: ${formatPrice(product.price)}\n` +
                    `رقم المنتج: ${product.id}\n\n` +
                    `يرجى التواصل معي لتأكيد الطلب.`;
    
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "تم توجيهك إلى واتساب",
      description: "ستتم إعادة توجيهك إلى واتساب لإكمال الطلب"
    });
  };

  return (
    <div className="product-card rounded-2xl p-6 shadow-lg">
      <img 
        src={product.imageUrl} 
        alt={product.name}
        className="w-full h-48 object-cover rounded-xl mb-4"
        loading="lazy"
      />
      <h4 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h4>
      <p className="text-gray-600 mb-4 text-sm">{product.description}</p>
      <div className="flex justify-between items-center mb-4">
        <span className="text-2xl font-bold text-primary">{formatPrice(product.price)}</span>
        <span className="text-sm text-gray-500">{product.category}</span>
      </div>
      <button 
        className="order-button w-full px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
        onClick={handleOrderNow}
      >
        <i className="fab fa-whatsapp text-lg"></i>
        اطلب الآن
      </button>
    </div>
  );
}
