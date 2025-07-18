import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { DeliveryArea } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface DeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeliveryModal({ isOpen, onClose }: DeliveryModalProps) {
  const { data: deliveryAreas, isLoading } = useQuery<DeliveryArea[]>({
    queryKey: ["/api/delivery-areas"],
    enabled: isOpen
  });

  const formatFee = (fee: number) => {
    return `${(fee / 100).toFixed(0)} ريال`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="glass-effect max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 text-right">
            مناطق التوصيل المتاحة
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="glass-effect rounded-lg p-4">
                <Skeleton className="h-8 w-8 rounded-full mx-auto mb-2" />
                <Skeleton className="h-6 w-3/4 mx-auto mb-1" />
                <Skeleton className="h-4 w-1/2 mx-auto mb-1" />
                <Skeleton className="h-3 w-2/3 mx-auto" />
              </div>
            ))
          ) : deliveryAreas && deliveryAreas.length > 0 ? (
            deliveryAreas.map((area) => (
              <div key={area.id} className="glass-effect rounded-lg p-4 text-center">
                <i className="fas fa-map-marker-alt text-2xl text-primary mb-2"></i>
                <h4 className="font-bold text-lg mb-1">{area.name}</h4>
                <p className="text-sm text-gray-600">رسوم التوصيل: {formatFee(area.fee)}</p>
                <p className="text-xs text-gray-500 mt-1">مدة التوصيل: {area.deliveryTime}</p>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-8">
              <i className="fas fa-exclamation-circle text-4xl text-gray-400 mb-4"></i>
              <p className="text-gray-600">لا توجد مناطق توصيل متاحة حالياً</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
