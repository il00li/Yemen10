import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Product, DeliveryArea, Setting, Category, InsertProduct, InsertDeliveryArea, InsertCategory } from "@shared/schema";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { GlassButton } from "./glass-button";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminModal({ isOpen, onClose }: AdminModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [newProduct, setNewProduct] = useState<InsertProduct>({
    name: "",
    description: "",
    fullDescription: "",
    price: 0,
    category: "",
    imageUrl: ""
  });

  const [isUploading, setIsUploading] = useState(false);

  const [newDeliveryArea, setNewDeliveryArea] = useState<InsertDeliveryArea>({
    name: "",
    fee: 0,
    deliveryTime: ""
  });

  const [newCategory, setNewCategory] = useState<InsertCategory>({
    name: ""
  });

  const [settings, setSettings] = useState<Record<string, string>>({});

  // Queries
  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    enabled: isOpen
  });

  const { data: deliveryAreas, isLoading: areasLoading } = useQuery<DeliveryArea[]>({
    queryKey: ["/api/delivery-areas"],
    enabled: isOpen
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    enabled: isOpen
  });

  const { data: settingsData, isLoading: settingsLoading } = useQuery<Setting[]>({
    queryKey: ["/api/settings"],
    enabled: isOpen,
    onSuccess: (data) => {
      const settingsMap: Record<string, string> = {};
      data?.forEach(setting => {
        settingsMap[setting.key] = setting.value;
      });
      setSettings(settingsMap);
    }
  });

  // Mutations
  const createProductMutation = useMutation({
    mutationFn: (data: InsertProduct) => apiRequest("POST", "/api/products", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setNewProduct({ name: "", description: "", fullDescription: "", price: 0, category: "", imageUrl: "" });
      toast({ title: "تم إضافة المنتج بنجاح" });
    },
    onError: () => {
      toast({ title: "فشل في إضافة المنتج", variant: "destructive" });
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "تم حذف المنتج بنجاح" });
    },
    onError: () => {
      toast({ title: "فشل في حذف المنتج", variant: "destructive" });
    }
  });

  const createDeliveryAreaMutation = useMutation({
    mutationFn: (data: InsertDeliveryArea) => apiRequest("POST", "/api/delivery-areas", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/delivery-areas"] });
      setNewDeliveryArea({ name: "", fee: 0, deliveryTime: "" });
      toast({ title: "تم إضافة منطقة التوصيل بنجاح" });
    },
    onError: () => {
      toast({ title: "فشل في إضافة منطقة التوصيل", variant: "destructive" });
    }
  });

  const deleteDeliveryAreaMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/delivery-areas/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/delivery-areas"] });
      toast({ title: "تم حذف منطقة التوصيل بنجاح" });
    },
    onError: () => {
      toast({ title: "فشل في حذف منطقة التوصيل", variant: "destructive" });
    }
  });

  const createCategoryMutation = useMutation({
    mutationFn: (data: InsertCategory) => apiRequest("POST", "/api/categories", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setNewCategory({ name: "" });
      toast({ title: "تم إضافة التصنيف بنجاح" });
    },
    onError: () => {
      toast({ title: "فشل في إضافة التصنيف", variant: "destructive" });
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: "تم حذف التصنيف بنجاح" });
    },
    onError: () => {
      toast({ title: "فشل في حذف التصنيف", variant: "destructive" });
    }
  });

  const updateSettingMutation = useMutation({
    mutationFn: (data: { key: string; value: string }) => 
      apiRequest("POST", "/api/settings", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({ title: "تم حفظ الإعدادات بنجاح" });
    },
    onError: () => {
      toast({ title: "فشل في حفظ الإعدادات", variant: "destructive" });
    }
  });

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.description || newProduct.price <= 0) {
      toast({ title: "يرجى ملء جميع الحقول المطلوبة", variant: "destructive" });
      return;
    }
    createProductMutation.mutate(newProduct);
  };

  const handleAddDeliveryArea = () => {
    if (!newDeliveryArea.name || newDeliveryArea.fee <= 0 || !newDeliveryArea.deliveryTime) {
      toast({ title: "يرجى ملء جميع الحقول المطلوبة", variant: "destructive" });
      return;
    }
    createDeliveryAreaMutation.mutate(newDeliveryArea);
  };

  const handleAddCategory = () => {
    if (!newCategory.name) {
      toast({ title: "يرجى إدخال اسم التصنيف", variant: "destructive" });
      return;
    }
    createCategoryMutation.mutate(newCategory);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('فشل في رفع الصورة');
      }
      
      const result = await response.json();
      setNewProduct(prev => ({ ...prev, imageUrl: result.imageUrl }));
      
      toast({
        title: "تم رفع الصورة بنجاح",
        description: "يمكنك الآن إضافة المنتج"
      });
    } catch (error) {
      toast({
        title: "فشل في رفع الصورة",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveSettings = () => {
    Object.entries(settings).forEach(([key, value]) => {
      updateSettingMutation.mutate({ key, value });
    });
  };

  const formatPrice = (price: number) => `${(price / 100).toFixed(0)} ريال`;
  const formatFee = (fee: number) => `${(fee / 100).toFixed(0)} ريال`;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="glass-effect max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 text-right">
            لوحة الإدارة
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="products" className="w-full" dir="rtl">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products">المنتجات</TabsTrigger>
            <TabsTrigger value="categories">التصنيفات</TabsTrigger>
            <TabsTrigger value="delivery">مناطق التوصيل</TabsTrigger>
            <TabsTrigger value="settings">الإعدادات</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">إدارة المنتجات</h3>
            </div>

            {/* Add new product form */}
            <div className="glass-effect rounded-lg p-4 space-y-4">
              <h4 className="font-bold text-right">إضافة منتج جديد</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="productName">اسم المنتج</Label>
                  <Input
                    id="productName"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                    className="text-right"
                  />
                </div>
                <div>
                  <Label htmlFor="productCategory">الفئة</Label>
                  <Input
                    id="productCategory"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                    className="text-right"
                  />
                </div>
                <div>
                  <Label htmlFor="productPrice">السعر (بالهللة)</Label>
                  <Input
                    id="productPrice"
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <Label htmlFor="productImage">صورة المنتج</Label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      disabled={isUploading}
                    />
                    {isUploading && <p className="text-sm text-blue-600">جاري رفع الصورة...</p>}
                    {newProduct.imageUrl && (
                      <div className="mt-2">
                        <img 
                          src={newProduct.imageUrl} 
                          alt="معاينة الصورة" 
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="productDescription">الوصف المختصر</Label>
                  <Textarea
                    id="productDescription"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                    className="text-right"
                    rows={2}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="productFullDescription">الوصف الكامل</Label>
                  <Textarea
                    id="productFullDescription"
                    value={newProduct.fullDescription}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, fullDescription: e.target.value }))}
                    className="text-right"
                    rows={4}
                    placeholder="وصف تفصيلي للمنتج يظهر عند الضغط على زر التفاصيل"
                  />
                </div>
              </div>
              <GlassButton 
                onClick={handleAddProduct}
                disabled={createProductMutation.isPending}
              >
                {createProductMutation.isPending ? "جاري الإضافة..." : "إضافة المنتج"}
              </GlassButton>
            </div>

            {/* Products list */}
            <div className="space-y-4">
              {productsLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="glass-effect rounded-lg p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))
              ) : products && products.length > 0 ? (
                products.map((product) => (
                  <div key={product.id} className="glass-effect rounded-lg p-4 flex justify-between items-center">
                    <div className="text-right">
                      <h5 className="font-bold">{product.name}</h5>
                      <p className="text-sm text-gray-600">{formatPrice(product.price)} - {product.category}</p>
                    </div>
                    <div className="space-x-2 space-x-reverse">
                      <GlassButton 
                        size="sm" 
                        variant="outline"
                        onClick={() => deleteProductMutation.mutate(product.id)}
                        disabled={deleteProductMutation.isPending}
                        className="text-red-600 hover:bg-red-600 hover:text-white"
                      >
                        حذف
                      </GlassButton>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">لا توجد منتجات</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">إدارة التصنيفات</h3>
            </div>

            {/* Add new category form */}
            <div className="glass-effect rounded-lg p-4 space-y-4">
              <h4 className="font-bold text-right">إضافة تصنيف جديد</h4>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="categoryName">اسم التصنيف</Label>
                  <Input
                    id="categoryName"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                    className="text-right"
                    placeholder="مثال: ملابس رجالية"
                  />
                </div>
                <GlassButton 
                  onClick={handleAddCategory}
                  disabled={createCategoryMutation.isPending}
                >
                  {createCategoryMutation.isPending ? "جاري الإضافة..." : "إضافة التصنيف"}
                </GlassButton>
              </div>
            </div>

            {/* Categories list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoriesLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="glass-effect rounded-lg p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                ))
              ) : categories && categories.length > 0 ? (
                categories.map((category) => (
                  <div key={category.id} className="glass-effect rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <h5 className="font-bold text-lg">{category.name}</h5>
                      <GlassButton 
                        size="sm" 
                        variant="outline"
                        onClick={() => deleteCategoryMutation.mutate(category.id)}
                        disabled={deleteCategoryMutation.isPending}
                        className="text-red-600 hover:bg-red-600 hover:text-white"
                      >
                        حذف
                      </GlassButton>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-8">
                  <p className="text-gray-600">لا توجد تصنيفات</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="delivery" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">إدارة مناطق التوصيل</h3>
            </div>

            {/* Add new delivery area form */}
            <div className="glass-effect rounded-lg p-4 space-y-4">
              <h4 className="font-bold text-right">إضافة منطقة توصيل جديدة</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="areaName">اسم المنطقة</Label>
                  <Input
                    id="areaName"
                    value={newDeliveryArea.name}
                    onChange={(e) => setNewDeliveryArea(prev => ({ ...prev, name: e.target.value }))}
                    className="text-right"
                  />
                </div>
                <div>
                  <Label htmlFor="areaFee">رسوم التوصيل (بالهللة)</Label>
                  <Input
                    id="areaFee"
                    type="number"
                    value={newDeliveryArea.fee}
                    onChange={(e) => setNewDeliveryArea(prev => ({ ...prev, fee: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <Label htmlFor="areaTime">مدة التوصيل</Label>
                  <Input
                    id="areaTime"
                    value={newDeliveryArea.deliveryTime}
                    onChange={(e) => setNewDeliveryArea(prev => ({ ...prev, deliveryTime: e.target.value }))}
                    className="text-right"
                  />
                </div>
              </div>
              <GlassButton 
                onClick={handleAddDeliveryArea}
                disabled={createDeliveryAreaMutation.isPending}
              >
                {createDeliveryAreaMutation.isPending ? "جاري الإضافة..." : "إضافة المنطقة"}
              </GlassButton>
            </div>

            {/* Delivery areas list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {areasLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="glass-effect rounded-lg p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                ))
              ) : deliveryAreas && deliveryAreas.length > 0 ? (
                deliveryAreas.map((area) => (
                  <div key={area.id} className="glass-effect rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-bold">{area.name}</h5>
                      <GlassButton 
                        size="sm" 
                        variant="outline"
                        onClick={() => deleteDeliveryAreaMutation.mutate(area.id)}
                        disabled={deleteDeliveryAreaMutation.isPending}
                        className="text-red-600 hover:bg-red-600 hover:text-white"
                      >
                        حذف
                      </GlassButton>
                    </div>
                    <p className="text-sm text-gray-600">رسوم التوصيل: {formatFee(area.fee)}</p>
                    <p className="text-sm text-gray-600">مدة التوصيل: {area.deliveryTime}</p>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-8">
                  <p className="text-gray-600">لا توجد مناطق توصيل</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <h3 className="text-lg font-bold">إعدادات الموقع</h3>
            
            {settingsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index}>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="whatsapp">رقم الواتساب</Label>
                  <Input
                    id="whatsapp"
                    value={settings.whatsapp_number || ""}
                    onChange={(e) => setSettings(prev => ({ ...prev, whatsapp_number: e.target.value }))}
                    className="text-right"
                  />
                </div>
                <div>
                  <Label htmlFor="telegram">رابط التليجرام</Label>
                  <Input
                    id="telegram"
                    value={settings.telegram_url || ""}
                    onChange={(e) => setSettings(prev => ({ ...prev, telegram_url: e.target.value }))}
                    className="text-right"
                  />
                </div>
                <div>
                  <Label htmlFor="instagram">رابط الانستقرام</Label>
                  <Input
                    id="instagram"
                    value={settings.instagram_url || ""}
                    onChange={(e) => setSettings(prev => ({ ...prev, instagram_url: e.target.value }))}
                    className="text-right"
                  />
                </div>
                <div>
                  <Label htmlFor="facebook">رابط الفيسبوك</Label>
                  <Input
                    id="facebook"
                    value={settings.facebook_url || ""}
                    onChange={(e) => setSettings(prev => ({ ...prev, facebook_url: e.target.value }))}
                    className="text-right"
                  />
                </div>
                <div>
                  <Label htmlFor="siteName">اسم الموقع</Label>
                  <Input
                    id="siteName"
                    value={settings.site_name || ""}
                    onChange={(e) => setSettings(prev => ({ ...prev, site_name: e.target.value }))}
                    className="text-right"
                  />
                </div>
                <div>
                  <Label htmlFor="adminPassword">كلمة مرور الإدارة</Label>
                  <Input
                    id="adminPassword"
                    type="password"
                    value={settings.admin_password || ""}
                    onChange={(e) => setSettings(prev => ({ ...prev, admin_password: e.target.value }))}
                    className="text-right"
                  />
                </div>
                <GlassButton 
                  onClick={handleSaveSettings}
                  disabled={updateSettingMutation.isPending}
                >
                  {updateSettingMutation.isPending ? "جاري الحفظ..." : "حفظ الإعدادات"}
                </GlassButton>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
