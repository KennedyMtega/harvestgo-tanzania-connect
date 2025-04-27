
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Menu, X, ShoppingBasket, ChevronDown, ChevronUp } from 'lucide-react';
import Map, { Marker } from '@/components/shared/Map';
import Layout from '@/components/layout/Layout';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Mock data
const mockVendors: Array<Vendor> = [
  {
    id: '1',
    name: 'Mazao Fresh Farm',
    rating: 4.8,
    distance: 1.2,
    position: [39.2183, -6.7824],
    items: [
      { id: '1', name: 'Tomatoes', price: 3000, unit: 'kg', inStock: true },
      { id: '2', name: 'Onions', price: 2500, unit: 'kg', inStock: true },
      { id: '3', name: 'Maize', price: 2000, unit: 'kg', inStock: true },
    ]
  },
  {
    id: '2',
    name: 'Kilimo Safi Store',
    rating: 4.5,
    distance: 2.3,
    position: [39.2283, -6.8024],
    items: [
      { id: '1', name: 'Tomatoes', price: 3200, unit: 'kg', inStock: true },
      { id: '2', name: 'Onions', price: 2400, unit: 'kg', inStock: true },
      { id: '4', name: 'Potatoes', price: 1800, unit: 'kg', inStock: true },
    ]
  },
  {
    id: '3',
    name: 'Green Harvest',
    rating: 4.2,
    distance: 3.0,
    position: [39.2083, -6.8124],
    items: [
      { id: '1', name: 'Tomatoes', price: 2800, unit: 'kg', inStock: true },
      { id: '3', name: 'Maize', price: 1900, unit: 'kg', inStock: true },
      { id: '5', name: 'Cabbage', price: 1500, unit: 'each', inStock: true },
    ]
  },
  {
    id: '4',
    name: 'Dar Organic Foods',
    rating: 4.7,
    distance: 3.5,
    position: [39.1983, -6.7724],
    items: [
      { id: '1', name: 'Tomatoes', price: 3500, unit: 'kg', inStock: true },
      { id: '6', name: 'Carrots', price: 2200, unit: 'kg', inStock: true },
      { id: '7', name: 'Spinach', price: 1200, unit: 'bunch', inStock: true },
    ]
  },
];

const cropCategories = [
  { id: '1', name: 'Vegetables', image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9' },
  { id: '2', name: 'Fruits', image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07' },
  { id: '3', name: 'Grains', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb' },
  { id: '4', name: 'Dairy', image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b' },
];

const crops = [
  { id: '1', name: 'Tomatoes', price: '2,800 - 3,500', unit: 'TZS/kg', category: '1' },
  { id: '2', name: 'Onions', price: '2,400 - 2,800', unit: 'TZS/kg', category: '1' },
  { id: '3', name: 'Maize', price: '1,900 - 2,200', unit: 'TZS/kg', category: '3' },
  { id: '4', name: 'Potatoes', price: '1,800 - 2,200', unit: 'TZS/kg', category: '1' },
  { id: '5', name: 'Cabbage', price: '1,500 - 2,000', unit: 'TZS/each', category: '1' },
  { id: '6', name: 'Carrots', price: '2,000 - 2,500', unit: 'TZS/kg', category: '1' },
  { id: '7', name: 'Spinach', price: '1,000 - 1,500', unit: 'TZS/bunch', category: '1' },
  { id: '8', name: 'Bananas', price: '5,000 - 7,000', unit: 'TZS/dozen', category: '2' },
  { id: '9', name: 'Oranges', price: '6,000 - 8,000', unit: 'TZS/dozen', category: '2' },
  { id: '10', name: 'Rice', price: '2,500 - 3,500', unit: 'TZS/kg', category: '3' },
];

interface Crop {
  id: string;
  name: string;
  price?: number | string;
  unit?: string;
  inStock?: boolean;
  quantity?: number;
  category?: string;
}

interface Vendor {
  id: string;
  name: string;
  rating: number;
  distance: number;
  position: [number, number];
  items: Crop[];
}

const BuyerMap: React.FC = () => {
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [showVendorDetail, setShowVendorDetail] = useState<boolean>(false);
  const [showCropList, setShowCropList] = useState<boolean>(false);
  const [selectedCrops, setSelectedCrops] = useState<Crop[]>([]);
  const [showingVendors, setShowingVendors] = useState<boolean>(false);
  const [availableVendors, setAvailableVendors] = useState<Vendor[]>([]);
  const [bottomSheetHeight, setBottomSheetHeight] = useState<'50%' | '25%' | '10%'>('25%');

  const handleMarkerClick = (vendorId: string) => {
    const vendor = mockVendors.find(v => v.id === vendorId);
    if (vendor) {
      setSelectedVendor(vendor);
      setShowVendorDetail(true);
    }
  };

  const toggleCropSelection = (crop: Crop) => {
    if (selectedCrops.some(c => c.id === crop.id)) {
      setSelectedCrops(selectedCrops.filter(c => c.id !== crop.id));
    } else {
      setSelectedCrops([...selectedCrops, crop]);
    }
  };

  const showAvailableVendors = () => {
    // In a real app, we would filter vendors based on selected crops availability
    if (selectedCrops.length > 0) {
      setAvailableVendors(mockVendors);
      setShowingVendors(true);
      setBottomSheetHeight('10%');
    }
  };

  const resetSelection = () => {
    setSelectedCrops([]);
    setShowingVendors(false);
    setAvailableVendors([]);
    setShowVendorDetail(false);
    setBottomSheetHeight('25%');
  };

  return (
    <Layout userType="buyer" hideFooter hideHeader>
      <div className="h-screen relative">
        <Map 
          markers={
            showingVendors 
              ? availableVendors.map(vendor => ({
                  id: vendor.id,
                  position: vendor.position,
                  type: 'vendor',
                  data: { name: vendor.name }
                }))
              : []
          } 
          onMarkerClick={handleMarkerClick}
        />

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between z-20">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="secondary" className="rounded-full shadow-md">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="py-6 space-y-6">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 bg-primary-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">H</span>
                  </div>
                  <span className="font-heading font-bold text-xl">HarvestGo</span>
                </div>
                
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="/buyer/profile">My Profile</a>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="/buyer/orders">My Orders</a>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="/buyer/payment-methods">Payment Methods</a>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="/buyer/addresses">Saved Addresses</a>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="/buyer/settings">Settings</a>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="/help">Help & Support</a>
                  </Button>
                </div>
                
                <div className="pt-4 border-t">
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/logout">Logout</a>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          <Button variant="secondary" className="rounded-full shadow-md" asChild>
            <a href="/search">
              <Search size={20} className="mr-2" />
              <span>Search Crops</span>
            </a>
          </Button>
          
          <Button size="icon" variant="secondary" className="rounded-full shadow-md" asChild>
            <a href="/buyer/cart">
              <ShoppingBasket size={20} />
            </a>
          </Button>
        </div>
        
        {/* Bottom Sheet for Crops */}
        {!showingVendors && (
          <div 
            className="absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl shadow-lg z-20 transition-all duration-300"
            style={{ height: bottomSheetHeight }}
          >
            <div className="p-4 h-full">
              <div className="flex justify-center mb-2">
                <div 
                  className="w-12 h-1.5 bg-gray-300 rounded-full cursor-pointer"
                  onClick={() => setBottomSheetHeight(bottomSheetHeight === '25%' ? '50%' : '25%')}
                ></div>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-heading font-bold text-lg">Browse Crops</h2>
                {bottomSheetHeight === '50%' && (
                  <Button size="sm" variant="ghost" onClick={() => setBottomSheetHeight('25%')}>
                    <ChevronDown size={20} />
                  </Button>
                )}
                {bottomSheetHeight === '25%' && (
                  <Button size="sm" variant="ghost" onClick={() => setBottomSheetHeight('50%')}>
                    <ChevronUp size={20} />
                  </Button>
                )}
              </div>
              
              {showCropList ? (
                <div className="h-full overflow-auto pb-20">
                  <div className="mb-4 flex justify-between items-center">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => setShowCropList(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6"/>
                      </svg>
                      Back
                    </Button>
                    
                    <div className="text-sm">
                      <span className="font-medium">{selectedCrops.length}</span> selected
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {crops.map(crop => (
                      <div 
                        key={crop.id}
                        className={`crop-card ${selectedCrops.some(c => c.id === crop.id) ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : ''}`}
                        onClick={() => toggleCropSelection(crop)}
                      >
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg mr-3 flex-shrink-0"></div>
                          <div>
                            <h3 className="font-medium">{crop.name}</h3>
                            <p className="text-sm text-gray-500">{crop.price} {crop.unit}</p>
                          </div>
                        </div>
                        
                        <div className="w-6 h-6 rounded-full border flex items-center justify-center">
                          {selectedCrops.some(c => c.id === crop.id) && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {selectedCrops.length > 0 && (
                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
                      <Button onClick={showAvailableVendors} className="w-full">
                        Show Vendors ({selectedCrops.length} crops)
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {cropCategories.map(category => (
                    <div 
                      key={category.id}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden h-28 relative cursor-pointer"
                      onClick={() => setShowCropList(true)}
                    >
                      <div 
                        className="absolute inset-0 bg-cover bg-center" 
                        style={{ backgroundImage: `url(${category.image})` }}
                      >
                        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white font-medium text-lg">{category.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Bottom bar - Show selected crops when vendors are displayed */}
        {showingVendors && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-background rounded-t-3xl shadow-lg z-20">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Selected Crops</h3>
                <p className="text-sm text-gray-500">{selectedCrops.length} items selected</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" onClick={resetSelection}>
                  Reset
                </Button>
                <Button variant="outline" size="sm" onClick={() => setBottomSheetHeight(bottomSheetHeight === '10%' ? '25%' : '10%')}>
                  {bottomSheetHeight === '10%' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </Button>
              </div>
            </div>
            
            {bottomSheetHeight !== '10%' && (
              <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                {selectedCrops.map(crop => (
                  <div 
                    key={crop.id}
                    className="flex-shrink-0 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg px-3 py-2 flex items-center gap-2"
                  >
                    <span className="text-sm">{crop.name}</span>
                    <button onClick={() => toggleCropSelection(crop)}>
                      <X size={14} className="text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Vendor Detail Dialog */}
      <Dialog open={showVendorDetail} onOpenChange={setShowVendorDetail}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedVendor?.name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0" className="text-yellow-400 mr-1">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                <span className="font-medium">{selectedVendor?.rating.toFixed(1)}</span>
                <span className="text-gray-500 ml-1">(120+ ratings)</span>
              </div>
              
              <div className="text-sm">
                <span className="text-gray-500">{selectedVendor?.distance} km away</span>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Available Items</h3>
              <div className="space-y-3">
                {selectedVendor?.items.map(item => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <h4>{item.name}</h4>
                      <p className="text-sm text-gray-500">{item.price} TZS/{item.unit}</p>
                    </div>
                    
                    <Button size="sm">Add</Button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-4">
              <Button className="w-full">Order from this Vendor</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default BuyerMap;
