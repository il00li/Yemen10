import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Product, DeliveryArea, Setting, Category } from "@shared/schema";
import { ProductCard } from "@/components/product-card";
import { AdminModal } from "@/components/admin-modal";
import { DeliveryModal } from "@/components/delivery-modal";
import { GlassButton } from "@/components/glass-button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [clickTimer, setClickTimer] = useState<NodeJS.Timeout | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { toast } = useToast();

  // Queries
  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"]
  });

  const { data: settings } = useQuery<Setting[]>({
    queryKey: ["/api/settings"]
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"]
  });

  // Convert settings array to object for easier access
  const settingsMap = settings?.reduce((acc, setting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {} as Record<string, string>) || {};

  // Filter products by selected category
  const filteredProducts = selectedCategory 
    ? products?.filter(product => product.category === selectedCategory)
    : products;

  const handleSiteNameClick = () => {
    setClickCount(prev => prev + 1);
    
    if (clickTimer) {
      clearTimeout(clickTimer);
    }

    if (clickCount === 2) {
      // Third click
      setClickCount(0);
      handleAdminAccess();
    } else {
      const timer = setTimeout(() => {
        setClickCount(0);
      }, 1000);
      setClickTimer(timer);
    }
  };

  const handleAdminAccess = async () => {
    const password = prompt('أدخل كلمة المرور للوصول إلى لوحة الإدارة:');
    if (password === null) return;

    try {
      await apiRequest("POST", "/api/auth/admin", { password });
      setIsAdminModalOpen(true);
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك في لوحة الإدارة"
      });
    } catch (error) {
      toast({
        title: "كلمة المرور غير صحيحة",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    }
  };

  const socialLinks = [
    { 
      name: "whatsapp", 
      icon: "fab fa-whatsapp", 
      url: settingsMap.whatsapp_number ? `https://wa.me/${settingsMap.whatsapp_number}` : "#",
      color: "hover:text-green-500"
    },
    { 
      name: "telegram", 
      icon: "fab fa-telegram", 
      url: settingsMap.telegram_url || "#",
      color: "hover:text-blue-500"
    },
    { 
      name: "instagram", 
      icon: "fab fa-instagram", 
      url: settingsMap.instagram_url || "#",
      color: "hover:text-pink-500"
    },
    { 
      name: "facebook", 
      icon: "fab fa-facebook", 
      url: settingsMap.facebook_url || "#",
      color: "hover:text-blue-600"
    }
  ];

  useEffect(() => {
    return () => {
      if (clickTimer) {
        clearTimeout(clickTimer);
      }
    };
  }, [clickTimer]);

  const smoothScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen" dir="rtl">
      {/* Header */}
      <header className="glass-effect sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 
              className="text-3xl font-bold text-gray-800 cursor-pointer select-none"
              onClick={handleSiteNameClick}
            >
              {settingsMap.site_name || "متجر المنتجات الرقمية"}
            </h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            اكتشف منتجاتنا المميزة
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            نقدم لك أفضل المنتجات الرقمية بجودة عالية وأسعار تنافسية مع خدمة توصيل سريعة
          </p>
          <GlassButton 
            size="lg"
            onClick={() => smoothScrollTo('products')}
          >
            <i className="fas fa-arrow-down mr-2"></i>
            تصفح المنتجات
          </GlassButton>
        </div>
        
        {/* Floating Elements */}
        <div className="floating-element top-20 left-10 w-20 h-20 bg-primary"></div>
        <div className="floating-element bottom-20 right-10 w-16 h-16 bg-accent"></div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-8">منتجاتنا المتاحة</h3>
          
          {/* Category Filter Buttons */}
          {categories && categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <GlassButton
                onClick={() => setSelectedCategory(null)}
                className={`${!selectedCategory ? 'bg-primary text-white' : ''}`}
              >
                جميع المنتجات
              </GlassButton>
              {categories.map((category) => (
                <GlassButton
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`${selectedCategory === category.name ? 'bg-primary text-white' : ''}`}
                >
                  {category.name}
                </GlassButton>
              ))}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {productsLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="product-card rounded-2xl p-6 shadow-lg">
                  <Skeleton className="w-full h-48 rounded-xl mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex justify-between items-center mb-4">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-12 w-full" />
                </div>
              ))
            ) : filteredProducts && filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <i className="fas fa-box-open text-6xl text-gray-300 mb-4"></i>
                <h4 className="text-xl font-bold text-gray-600 mb-2">لا توجد منتجات متاحة</h4>
                <p className="text-gray-500">سيتم إضافة منتجات جديدة قريباً</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            {/* Delivery Areas Button */}
            <GlassButton 
              onClick={() => setIsDeliveryModalOpen(true)}
              className="text-gray-700 hover:text-primary"
            >
              <i className="fas fa-map-marker-alt ml-2"></i>
              مناطق التوصيل
            </GlassButton>
            
            {/* Social Media Icons */}
            <div className="flex space-x-4 space-x-reverse">
              {socialLinks.map((social) => (
                <a 
                  key={social.name}
                  href={social.url}
                  target={social.url !== "#" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className={`glass-button p-3 rounded-full transition-colors ${social.color}`}
                >
                  <i className={`${social.icon} text-xl`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AdminModal 
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
      
      <DeliveryModal 
        isOpen={isDeliveryModalOpen}
        onClose={() => setIsDeliveryModalOpen(false)}
      />

      {/* FontAwesome Icons */}
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
      />
    </div>
  );
}
