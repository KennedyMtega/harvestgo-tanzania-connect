
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Menu, X, ShoppingBasket, ChevronDown, ChevronUp, Clock, Check } from 'lucide-react';
import Map, { Marker } from '@/components/shared/Map';
import Layout from '@/components/layout/Layout';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

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

// Mock Bolt drivers data
const mockDrivers = [
  { id: 'd1', name: 'Ahmed M.', rating: 4.9, position: [39.2383, -6.7924] as [number, number], vehicle: 'Motorcycle' },
  { id: 'd2', name: 'Sarah K.', rating: 4.7, position: [39.2083, -6.7724] as [number, number], vehicle: 'Car' },
  { id: 'd3', name: 'John N.', rating: 4.8, position: [39.2283, -6.8124] as [number, number], vehicle: 'Motorcycle' },
];

const cropCategories = [
  { id: '1', name: 'Vegetables', image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9' },
  { id: '2', name: 'Fruits', image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07' },
  { id: '3', name: 'Grains', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb' },
  { id: '4', name: 'Dairy', image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b' },
];

const crops = [
  { id: '1', name: 'Tomatoes', price: 2800, priceRange: '2,800 - 3,500', unit: 'kg', category: '1' },
  { id: '2', name: 'Onions', price: 2400, priceRange: '2,400 - 2,800', unit: 'kg', category: '1' },
  { id: '3', name: 'Maize', price: 1900, priceRange: '1,900 - 2,200', unit: 'kg', category: '3' },
  { id: '4', name: 'Potatoes', price: 1800, priceRange: '1,800 - 2,200', unit: 'kg', category: '1' },
  { id: '5', name: 'Cabbage', price: 1500, priceRange: '1,500 - 2,000', unit: 'each', category: '1' },
  { id: '6', name: 'Carrots', price: 2000, priceRange: '2,000 - 2,500', unit: 'kg', category: '1' },
  { id: '7', name: 'Spinach', price: 1000, priceRange: '1,000 - 1,500', unit: 'bunch', category: '1' },
  { id: '8', name: 'Bananas', price: 5000, priceRange: '5,000 - 7,000', unit: 'dozen', category: '2' },
  { id: '9', name: 'Oranges', price: 6000, priceRange: '6,000 - 8,000', unit: 'dozen', category: '2' },
  { id: '10', name: 'Rice', price: 2500, priceRange: '2,500 - 3,500', unit: 'kg', category: '3' },
];

interface Crop {
  id: string;
  name: string;
  price?: number | string;
  priceRange?: string;
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

interface OrderStatus {
  stage: 'selecting' | 'vendors' | 'vendor_detail' | 'checkout' | 'waiting_confirmation' | 'confirmed' | 'driver_assigned' | 'pickup' | 'delivery';
  vendorId?: string;
  driverId?: string;
  orderItems?: {id: string, name: string, quantity: number, price: number}[];
  totalPrice?: number;
  vendorAccepted?: boolean;
  estimatedTime?: number;
}

const BuyerMap: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [showVendorDetail, setShowVendorDetail] = useState<boolean>(false);
  const [showCropList, setShowCropList] = useState<boolean>(false);
  const [selectedCrops, setSelectedCrops] = useState<Crop[]>([]);
  const [showingVendors, setShowingVendors] = useState<boolean>(false);
  const [availableVendors, setAvailableVendors] = useState<Vendor[]>([]);
  const [bottomSheetHeight, setBottomSheetHeight] = useState<'50%' | '25%' | '10%'>('25%');
  const [orderStatus, setOrderStatus] = useState<OrderStatus>({ stage: 'selecting' });
  const [quantityMap, setQuantityMap] = useState<Record<string, number>>({});
  const [highlightedMarker, setHighlightedMarker] = useState<string | undefined>(undefined);
  const [selectedDriver, setSelectedDriver] = useState<any | null>(null);
  const [showDriverInfo, setShowDriverInfo] = useState(false);
  const [showRoutes, setShowRoutes] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>('mpesa');
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  
  // Calculate total price for a vendor based on selected crops
  const calculateVendorTotalPrice = (vendor: Vendor | null) => {
    // Add null check to prevent the error
    if (!vendor) return 0;
    
    let total = 0;
    for (const crop of selectedCrops) {
      const vendorItem = vendor.items.find(item => item.id === crop.id);
      if (vendorItem && typeof vendorItem.price === 'number') {
        total += vendorItem.price * (quantityMap[crop.id] || 1);
      }
    }
    return total;
  };

  // Find vendors that have all selected crops
  useEffect(() => {
    if (selectedCrops.length > 0 && orderStatus.stage === 'vendors') {
      const cropIds = selectedCrops.map(crop => crop.id);
      
      // Filter vendors that have all selected crops
      const vendors = mockVendors.filter(vendor => {
        const vendorItemIds = vendor.items.map(item => item.id);
        return cropIds.every(id => vendorItemIds.includes(id));
      });
      
      // Sort by distance
      const sortedVendors = [...vendors].sort((a, b) => a.distance - b.distance);
      
      // Add total price information to each vendor
      const vendorsWithPrices = sortedVendors.map(vendor => {
        const totalPrice = calculateVendorTotalPrice(vendor);
        return {
          ...vendor,
          totalPrice
        };
      });
      
      setAvailableVendors(vendorsWithPrices);
    }
  }, [selectedCrops, quantityMap, orderStatus.stage]);

  // Handle marker click (vendor selection)
  const handleMarkerClick = (markerId: string) => {
    if (orderStatus.stage === 'vendors') {
      const vendor = availableVendors.find(v => v.id === markerId);
      if (vendor) {
        setSelectedVendor(vendor);
        setOrderStatus({ ...orderStatus, stage: 'vendor_detail', vendorId: vendor.id });
        setShowVendorDetail(true);
      }
    } else if (orderStatus.stage === 'driver_assigned' || 
              orderStatus.stage === 'pickup' || 
              orderStatus.stage === 'delivery') {
      if (markerId.startsWith('d')) {
        const driver = mockDrivers.find(d => d.id === markerId);
        if (driver) {
          setSelectedDriver(driver);
          setShowDriverInfo(true);
        }
      }
    }
  };

  // Toggle crop selection
  const toggleCropSelection = (crop: Crop) => {
    if (selectedCrops.some(c => c.id === crop.id)) {
      setSelectedCrops(selectedCrops.filter(c => c.id !== crop.id));
      
      // Remove quantity
      const newQuantityMap = {...quantityMap};
      delete newQuantityMap[crop.id];
      setQuantityMap(newQuantityMap);
    } else {
      setSelectedCrops([...selectedCrops, crop]);
      
      // Initialize quantity to 1
      setQuantityMap({...quantityMap, [crop.id]: 1});
    }
  };

  // Update quantity for a crop
  const updateQuantity = (cropId: string, delta: number) => {
    const currentQuantity = quantityMap[cropId] || 1;
    const newQuantity = Math.max(1, currentQuantity + delta);
    setQuantityMap({...quantityMap, [cropId]: newQuantity});
  };

  // Show available vendors
  const showAvailableVendors = () => {
    if (selectedCrops.length > 0) {
      setOrderStatus({ stage: 'vendors' });
      setShowingVendors(true);
      setBottomSheetHeight('10%');
    }
  };

  // Reset selection
  const resetSelection = () => {
    setSelectedCrops([]);
    setShowingVendors(false);
    setAvailableVendors([]);
    setShowVendorDetail(false);
    setBottomSheetHeight('25%');
    setOrderStatus({ stage: 'selecting' });
    setQuantityMap({});
    setHighlightedMarker(undefined);
    setShowRoutes([]);
    setSelectedVendor(null);
    setSelectedDriver(null);
  };

  // Proceed to checkout with selected vendor
  const proceedToCheckout = () => {
    if (selectedVendor) {
      // Create order items with quantities
      const orderItems = selectedCrops.map(crop => {
        const vendorItem = selectedVendor.items.find(item => item.id === crop.id);
        return {
          id: crop.id,
          name: crop.name,
          quantity: quantityMap[crop.id] || 1,
          price: typeof vendorItem?.price === 'number' ? vendorItem.price : 0
        };
      });
      
      const totalPrice = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      setOrderStatus({
        ...orderStatus,
        stage: 'checkout',
        orderItems,
        totalPrice
      });
      
      setShowVendorDetail(false);
      setShowOrderConfirmation(true);
    }
  };

  // Place order with vendor
  const placeOrder = () => {
    setShowOrderConfirmation(false);
    
    setOrderStatus({
      ...orderStatus,
      stage: 'waiting_confirmation',
      vendorAccepted: false
    });
    
    // Highlight the selected vendor
    setHighlightedMarker(orderStatus.vendorId);
    
    // Simulate vendor accepting order after 3 seconds
    setTimeout(() => {
      // Vendor accepts order
      setOrderStatus({
        ...orderStatus,
        stage: 'confirmed',
        vendorAccepted: true
      });
      
      toast({
        title: "Order Accepted",
        description: `${selectedVendor?.name} has accepted your order. Finding driver...`,
      });
      
      // Find nearest driver after 2 seconds
      setTimeout(() => {
        const driver = mockDrivers[0]; // Choose first driver as the nearest
        
        setSelectedDriver(driver);
        setOrderStatus({
          ...orderStatus,
          stage: 'driver_assigned',
          driverId: driver.id,
          estimatedTime: 15
        });
        
        toast({
          title: "Driver Assigned",
          description: `${driver.name} will pick up your order.`,
        });
        
        // Show route from driver to vendor
        setShowRoutes([{
          from: driver.position,
          to: selectedVendor?.position || [0, 0],
          type: 'vendor-to-driver'
        }]);
        
        setHighlightedMarker(driver.id);
        
        // Simulate driver picking up order after 5 seconds
        setTimeout(() => {
          setOrderStatus({
            ...orderStatus,
            stage: 'pickup',
            estimatedTime: 10
          });
          
          toast({
            title: "Order Picked Up",
            description: `${driver.name} has picked up your order and is on the way.`,
          });
          
          // Update route to show from vendor to buyer
          setShowRoutes([{
            from: selectedVendor?.position || [0, 0],
            to: [39.2083, -6.7924], // User's location
            type: 'driver-to-buyer'
          }]);
          
          // Simulate delivery after 5 more seconds
          setTimeout(() => {
            setOrderStatus({
              ...orderStatus,
              stage: 'delivery',
              estimatedTime: 0
            });
            
            toast({
              title: "Order Delivered",
              description: "Your order has been delivered. Enjoy!",
            });
            
            // Clear routes
            setTimeout(() => {
              setShowRoutes([]);
              // Reset everything after 3 seconds
              setTimeout(resetSelection, 3000);
            }, 3000);
            
          }, 5000);
          
        }, 5000);
        
      }, 2000);
      
    }, 3000);
  };

  // Generate markers for the map
  const generateMapMarkers = (): Marker[] => {
    const markers: Marker[] = [];
    
    // Add vendor markers when showing filtered vendors
    if (showingVendors && orderStatus.stage === 'vendors') {
      availableVendors.forEach(vendor => {
        markers.push({
          id: vendor.id,
          position: vendor.position,
          type: 'vendor',
          data: { 
            name: vendor.name,
            price: calculateVendorTotalPrice(vendor)
          }
        });
      });
    }
    
    // Add selected vendor marker during the order process
    if (selectedVendor && (orderStatus.stage === 'vendor_detail' || 
                          orderStatus.stage === 'checkout' || 
                          orderStatus.stage === 'waiting_confirmation' ||
                          orderStatus.stage === 'confirmed' ||
                          orderStatus.stage === 'driver_assigned' ||
                          orderStatus.stage === 'pickup' ||
                          orderStatus.stage === 'delivery')) {
      markers.push({
        id: selectedVendor.id,
        position: selectedVendor.position,
        type: 'vendor',
        data: { 
          name: selectedVendor.name,
          price: calculateVendorTotalPrice(selectedVendor)
        }
      });
    }
    
    // Add driver marker when assigned
    if (selectedDriver && (orderStatus.stage === 'driver_assigned' ||
                          orderStatus.stage === 'pickup' ||
                          orderStatus.stage === 'delivery')) {
      markers.push({
        id: selectedDriver.id,
        position: selectedDriver.position,
        type: 'driver',
        data: { name: selectedDriver.name }
      });
    }
    
    // Add user location
    markers.push({
      id: 'user',
      position: [39.2083, -6.7924],
      type: 'buyer'
    });
    
    return markers;
  };

  // Render order status UI based on current stage
  const renderOrderStatusUI = () => {
    switch (orderStatus.stage) {
      case 'waiting_confirmation':
        return (
          <div className="absolute top-20 left-0 right-0 flex justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 flex items-center space-x-2">
              <div className="animate-spin text-primary-500">
                <Clock size={20} />
              </div>
              <span>Waiting for vendor to accept your order...</span>
            </div>
          </div>
        );
        
      case 'confirmed':
        return (
          <div className="absolute top-20 left-0 right-0 flex justify-center">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg shadow-lg p-4 flex items-center space-x-2">
              <div className="text-green-500">
                <Check size={20} />
              </div>
              <span>Order confirmed! Finding a driver...</span>
            </div>
          </div>
        );
        
      case 'driver_assigned':
      case 'pickup':
      case 'delivery':
        return (
          <div className="absolute top-20 left-0 right-0 flex justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="text-blue-500">
                    {orderStatus.stage === 'driver_assigned' && <Clock size={20} />}
                    {orderStatus.stage === 'pickup' && <Clock size={20} />}
                    {orderStatus.stage === 'delivery' && <Check size={20} />}
                  </div>
                  <div>
                    <p className="font-medium">
                      {orderStatus.stage === 'driver_assigned' && 'Driver on the way to vendor'}
                      {orderStatus.stage === 'pickup' && 'Driver picked up your order'}
                      {orderStatus.stage === 'delivery' && 'Order delivered!'}
                    </p>
                    {orderStatus.estimatedTime > 0 && (
                      <p className="text-sm text-gray-500">
                        ETA: ~{orderStatus.estimatedTime} min
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <Layout userType="buyer" hideFooter hideHeader>
      <div className="h-screen relative">
        <Map 
          markers={generateMapMarkers()} 
          onMarkerClick={handleMarkerClick}
          showRoutes={showRoutes}
          highlightMarker={highlightedMarker}
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
        
        {/* Order Status UI */}
        {renderOrderStatusUI()}
        
        {/* Bottom Sheet for Crops */}
        {orderStatus.stage === 'selecting' && (
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
                        className={`p-3 border rounded-lg flex justify-between items-center cursor-pointer transition-colors ${
                          selectedCrops.some(c => c.id === crop.id) 
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                        onClick={() => toggleCropSelection(crop)}
                      >
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg mr-3 flex-shrink-0"></div>
                          <div>
                            <h3 className="font-medium">{crop.name}</h3>
                            <p className="text-sm text-gray-500">{crop.priceRange} {crop.unit}</p>
                          </div>
                        </div>
                        
                        {selectedCrops.some(c => c.id === crop.id) ? (
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                              <button 
                                className="w-8 h-8 flex items-center justify-center text-gray-500"
                                onClick={(e) => { e.stopPropagation(); updateQuantity(crop.id, -1); }}
                              >-</button>
                              <span className="w-6 text-center">{quantityMap[crop.id] || 1}</span>
                              <button 
                                className="w-8 h-8 flex items-center justify-center text-gray-500"
                                onClick={(e) => { e.stopPropagation(); updateQuantity(crop.id, 1); }}
                              >+</button>
                            </div>
                            <div className="w-6 h-6 rounded-full border-2 border-primary-500 flex items-center justify-center bg-primary-500">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                            </div>
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600"></div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {selectedCrops.length > 0 && (
                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
                      <Button onClick={showAvailableVendors} className="w-full">
                        Find Vendors ({selectedCrops.length} crops)
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
        {orderStatus.stage === 'vendors' && showingVendors && (
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
                    <span className="text-sm">{crop.name} ({quantityMap[crop.id] || 1})</span>
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
              <h3 className="font-medium mb-2">Selected Items</h3>
              <div className="space-y-3">
                {selectedCrops.map(crop => {
                  const vendorItem = selectedVendor?.items.find(item => item.id === crop.id);
                  const quantity = quantityMap[crop.id] || 1;
                  const itemPrice = typeof vendorItem?.price === 'number' ? vendorItem.price : 0;
                  
                  return (
                    <div key={crop.id} className="flex justify-between items-center">
                      <div>
                        <h4>{crop.name} (x{quantity})</h4>
                        <p className="text-sm text-gray-500">{itemPrice} TZS/{vendorItem?.unit}</p>
                      </div>
                      
                      <div className="font-medium">
                        {(itemPrice * quantity).toLocaleString()} TZS
                      </div>
                    </div>
                  );
                })}
                
                <div className="pt-3 border-t flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{calculateVendorTotalPrice(selectedVendor!).toLocaleString()} TZS</span>
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <Button className="w-full" onClick={proceedToCheckout}>
                Checkout
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Order Confirmation Dialog */}
      <Dialog open={showOrderConfirmation} onOpenChange={setShowOrderConfirmation}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Order</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Delivery Address</h3>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                <p>123 Uhuru Street, Dar es Salaam</p>
                <p className="text-sm text-gray-500">Home</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Payment Method</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'mpesa', name: 'M-Pesa', icon: 'M', color: 'bg-green-500' },
                  { id: 'airtel', name: 'Airtel Money', icon: 'A', color: 'bg-red-500' },
                  { id: 'card', name: 'Credit Card', icon: 'C', color: 'bg-blue-500' },
                  { id: 'cash', name: 'Cash', icon: '$', color: 'bg-gray-500' },
                ].map((method) => (
                  <div 
                    key={method.id}
                    className={`border rounded-lg p-3 flex items-center cursor-pointer ${
                      paymentMethod === method.id 
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                      : 'border-gray-200 dark:border-gray-700'
                    }`}
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <div className={`w-8 h-8 ${method.color} rounded-lg flex items-center justify-center text-white mr-2`}>
                      {method.icon}
                    </div>
                    <span>{method.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t pt-3">
              <h3 className="font-medium mb-2">Order Summary</h3>
              <div className="space-y-2">
                {orderStatus.orderItems?.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.name}</span>
                    <span>{(item.price * item.quantity).toLocaleString()} TZS</span>
                  </div>
                ))}
                
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{orderStatus.totalPrice?.toLocaleString()} TZS</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Delivery Fee</span>
                    <span>2,000 TZS</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Service Fee</span>
                    <span>1,000 TZS</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-1 mt-1 border-t">
                    <span>Total</span>
                    <span>{(orderStatus.totalPrice ? orderStatus.totalPrice + 3000 : 3000).toLocaleString()} TZS</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-3">
              <Button className="w-full" onClick={placeOrder}>
                Place Order
              </Button>
              <p className="text-center text-xs mt-2 text-gray-500">
                By placing this order, you agree to our Terms of Service
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Driver Info Dialog */}
      <Dialog open={showDriverInfo} onOpenChange={setShowDriverInfo}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Driver Info</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full mr-3"></div>
              <div>
                <h3 className="font-medium">{selectedDriver?.name}</h3>
                <p className="text-sm text-gray-500">{selectedDriver?.vehicle} • {selectedDriver?.rating} ⭐</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                Call
              </Button>
              <Button variant="outline">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Message
              </Button>
            </div>
            
            {orderStatus.estimatedTime && orderStatus.estimatedTime > 0 && (
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 flex items-center justify-between">
                <span>Estimated arrival time</span>
                <span className="font-medium">{orderStatus.estimatedTime} minutes</span>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default BuyerMap;
