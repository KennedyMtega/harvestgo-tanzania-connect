import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/layout/Layout';
import Map, { Marker } from '@/components/shared/Map';
import { useToast } from '@/hooks/use-toast';
import { 
  Clock, 
  DollarSign, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  ChevronRight,
  Check,
  Navigation
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const availablePickups = [
  {
    id: '1',
    vendorName: 'Mazao Fresh Farm',
    vendorLocation: '123 Samora Avenue, Dar es Salaam',
    vendorPosition: [39.2183, -6.7824],
    customerLocation: '456 Uhuru Street, Dar es Salaam',
    customerPosition: [39.2383, -6.8124],
    distance: 2.3,
    estimatedFare: 5000,
    items: 3,
    createdAt: '12:45 PM',
  },
  {
    id: '2',
    vendorName: 'Green Harvest',
    vendorLocation: '789 Bagamoyo Road, Dar es Salaam',
    vendorPosition: [39.2083, -6.8124],
    customerLocation: '321 Morogoro Road, Dar es Salaam',
    customerPosition: [39.2483, -6.7924],
    distance: 3.5,
    estimatedFare: 7500,
    items: 5,
    createdAt: '12:42 PM',
  },
];

const activeDeliveries = [
  {
    id: '3',
    status: 'accepted',
    vendorName: 'Kilimo Safi Store',
    vendorLocation: '456 Nyerere Road, Dar es Salaam',
    vendorPosition: [39.2283, -6.8024],
    customerName: 'John Doe',
    customerPhone: '+255712345678',
    customerLocation: '789 Kijitonyama, Dar es Salaam',
    customerPosition: [39.2183, -6.7724],
    distance: 2.8,
    estimatedFare: 6000,
    items: [
      { id: '1', name: 'Tomatoes', quantity: 3 },
      { id: '2', name: 'Onions', quantity: 2 },
    ],
    createdAt: '12:30 PM',
  },
];

const completedDeliveries = [
  {
    id: '4',
    vendorName: 'Dar Organic Foods',
    customerName: 'Mary Smith',
    status: 'completed',
    fare: 4500,
    completedAt: '11:45 AM',
  },
  {
    id: '5',
    vendorName: 'Mazao Fresh Farm',
    customerName: 'David Williams',
    status: 'completed',
    fare: 6500,
    completedAt: '10:20 AM',
  },
  {
    id: '6',
    vendorName: 'Green Harvest',
    customerName: 'Sarah Johnson',
    status: 'completed',
    fare: 5000,
    completedAt: '09:15 AM',
  },
];

const DriverDashboard: React.FC = () => {
  const { toast } = useToast();
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [showPickupDetails, setShowPickupDetails] = useState<boolean>(false);
  const [selectedPickup, setSelectedPickup] = useState<any>(null);
  const [totalEarnings, setTotalEarnings] = useState<number>(16000);
  const [deliveriesCompleted, setDeliveriesCompleted] = useState<number>(3);
  const [activeDelivery, setActiveDelivery] = useState<any>(activeDeliveries[0]);
  
  const [completedDeliveries, setCompletedDeliveries] = useState<any[]>([
    {
      id: '4',
      vendorName: 'Dar Organic Foods',
      customerName: 'Mary Smith',
      status: 'completed',
      fare: 4500,
      completedAt: '11:45 AM',
    },
    {
      id: '5',
      vendorName: 'Mazao Fresh Farm',
      customerName: 'David Williams',
      status: 'completed',
      fare: 6500,
      completedAt: '10:20 AM',
    },
    {
      id: '6',
      vendorName: 'Green Harvest',
      customerName: 'Sarah Johnson',
      status: 'completed',
      fare: 5000,
      completedAt: '09:15 AM',
    },
  ]);

  useEffect(() => {
    if (!activeDelivery) return;
    
    const interval = setInterval(() => {
      if (activeDelivery.status === 'accepted') {
        setActiveDelivery((prev: any) => ({
          ...prev,
          driverPosition: [
            prev.driverPosition?.[0] || 39.2183,
            (prev.driverPosition?.[1] || -6.8124) + 0.001
          ]
        }));
      } else if (activeDelivery.status === 'picked_up') {
        setActiveDelivery((prev: any) => ({
          ...prev,
          driverPosition: [
            (prev.driverPosition?.[0] || 39.2283) + 0.0005,
            (prev.driverPosition?.[1] || -6.8024) - 0.0005
          ]
        }));
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [activeDelivery]);
  
  const handleToggleOnline = () => {
    setIsOnline(!isOnline);
    toast({
      title: isOnline ? "You're Offline" : "You're Online",
      description: isOnline ? "You won't receive pickup requests." : "You'll now receive pickup requests.",
    });
  };
  
  const viewPickupDetails = (pickup: any) => {
    setSelectedPickup(pickup);
    setShowPickupDetails(true);
  };
  
  const acceptPickup = () => {
    if (!selectedPickup) return;
    
    toast({
      title: "Pickup Accepted",
      description: `You've accepted a pickup from ${selectedPickup.vendorName}.`,
    });
    
    const newDelivery = {
      ...selectedPickup,
      status: 'accepted',
      customerName: 'New Customer',
      customerPhone: '+255712345678',
      driverPosition: [39.2183, -6.8124],
    };
    
    setActiveDelivery(newDelivery);
    setShowPickupDetails(false);
  };
  
  const rejectPickup = () => {
    if (!selectedPickup) return;
    
    toast({
      title: "Pickup Rejected",
      description: "You've rejected the pickup request.",
    });
    setShowPickupDetails(false);
  };
  
  const markAsPickedUp = () => {
    if (!activeDelivery) return;
    
    setActiveDelivery({
      ...activeDelivery,
      status: 'picked_up',
    });
    
    toast({
      title: "Order Picked Up",
      description: "You've marked the order as picked up. Head to the delivery location.",
    });
  };
  
  const markAsDelivered = () => {
    if (!activeDelivery) return;
    
    const newCompletedDelivery = {
      id: activeDelivery.id,
      vendorName: activeDelivery.vendorName,
      customerName: activeDelivery.customerName,
      status: 'completed',
      fare: activeDelivery.estimatedFare,
      completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setCompletedDeliveries([newCompletedDelivery, ...completedDeliveries]);
    setDeliveriesCompleted(deliveriesCompleted + 1);
    setTotalEarnings(totalEarnings + activeDelivery.estimatedFare);
    setActiveDelivery(null);
    
    toast({
      title: "Delivery Completed",
      description: `You've successfully completed the delivery. Earned ${activeDelivery.estimatedFare.toLocaleString()} TZS.`,
    });
  };
  
  const getMapMarkers = () => {
    const markers: Marker[] = [];
    
    if (activeDelivery) {
      markers.push({
        id: `vendor-${activeDelivery.id}`,
        position: activeDelivery.vendorPosition,
        type: 'vendor',
        data: { name: activeDelivery.vendorName }
      });
      
      markers.push({
        id: `customer-${activeDelivery.id}`,
        position: activeDelivery.customerPosition,
        type: 'buyer',
        data: { name: activeDelivery.customerName }
      });
      
      if (activeDelivery.driverPosition) {
        markers.push({
          id: `driver-${activeDelivery.id}`,
          position: activeDelivery.driverPosition,
          type: 'driver'
        });
      }
    }
    
    return markers;
  };
  
  return (
    <Layout userType="driver" hideFooter>
      <div className="h-screen flex flex-col">
        <div className="flex-1 relative">
          <Map 
            markers={getMapMarkers()}
            center={activeDelivery?.driverPosition || activeDelivery?.vendorPosition || [39.2183, -6.7824]}
          />
          
          <div className="absolute top-4 left-4 right-4 z-10">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span className="font-medium">{isOnline ? 'Online' : 'Offline'}</span>
              </div>
              <Switch checked={isOnline} onCheckedChange={handleToggleOnline} />
            </div>
          </div>
          
          {activeDelivery && (
            <div className="absolute bottom-4 left-4 right-4 z-10">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-base">
                        {activeDelivery.status === 'accepted' ? 'Headed to Pickup' : 'Delivering Order'}
                      </CardTitle>
                      <CardDescription>
                        {activeDelivery.status === 'accepted' ? activeDelivery.vendorName : activeDelivery.customerName}
                      </CardDescription>
                    </div>
                    <div>
                      <div className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-1 rounded text-xs font-medium">
                        {activeDelivery.estimatedFare.toLocaleString()} TZS
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="mr-2 mt-1">
                        <div className="w-4 h-4 rounded-full bg-green-500"></div>
                        <div className="w-0.5 h-8 bg-gray-300 dark:bg-gray-600 mx-auto"></div>
                        <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                      </div>
                      <div className="flex-1 text-sm">
                        <p className="font-medium">{activeDelivery.vendorName}</p>
                        <p className="text-gray-500 text-xs mb-4">{activeDelivery.vendorLocation}</p>
                        <p className="font-medium">{activeDelivery.customerName}</p>
                        <p className="text-gray-500 text-xs">{activeDelivery.customerLocation}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        <span>{activeDelivery.distance.toFixed(1)} km away</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign size={14} className="mr-1" />
                        <span>{activeDelivery.estimatedFare.toLocaleString()} TZS</span>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      {activeDelivery.status === 'accepted' ? (
                        <Button className="w-full" onClick={markAsPickedUp}>
                          <CheckCircle size={16} className="mr-1" />
                          Mark as Picked Up
                        </Button>
                      ) : (
                        <Button className="w-full" onClick={markAsDelivered}>
                          <CheckCircle size={16} className="mr-1" />
                          Mark as Delivered
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
        
        {!activeDelivery && (
          <div className="bg-white dark:bg-gray-800 rounded-t-xl shadow-lg h-1/2 overflow-hidden">
            <div className="p-4">
              <Tabs defaultValue="available">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="available">Available</TabsTrigger>
                  <TabsTrigger value="earnings">Earnings</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="available">
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Available Pickups</h2>
                    
                    {isOnline ? (
                      <>
                        {availablePickups.length > 0 ? (
                          <div className="space-y-3 max-h-96 overflow-auto pb-4">
                            {availablePickups.map((pickup) => (
                              <Card key={pickup.id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => viewPickupDetails(pickup)}>
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-medium">{pickup.vendorName}</h3>
                                    <span className="text-primary-500 font-medium">{pickup.estimatedFare.toLocaleString()} TZS</span>
                                  </div>
                                  <div className="flex items-center text-sm text-gray-500 mb-2">
                                    <MapPin size={14} className="mr-1" />
                                    {pickup.distance.toFixed(1)} km away
                                    <Clock size={14} className="ml-3 mr-1" />
                                    {pickup.createdAt}
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm">{pickup.items} items</span>
                                    <Button variant="ghost" size="sm">
                                      View Details
                                      <ChevronRight size={16} className="ml-1" />
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-gray-500">No available pickups at the moment</p>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8">
                        <AlertTriangle size={48} className="text-gray-400 mb-4" />
                        <p className="text-gray-500 text-center mb-4">
                          You're currently offline. Go online to receive pickup requests.
                        </p>
                        <Button onClick={handleToggleOnline}>Go Online</Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="earnings">
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Your Earnings</h2>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4 flex flex-col items-center justify-center">
                          <span className="text-gray-500 text-sm">Today's Earnings</span>
                          <span className="text-2xl font-bold">{totalEarnings.toLocaleString()} TZS</span>
                          <span className="text-xs text-gray-500">{deliveriesCompleted} deliveries</span>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4 flex flex-col items-center justify-center">
                          <span className="text-gray-500 text-sm">Weekly Earnings</span>
                          <span className="text-2xl font-bold">95,500 TZS</span>
                          <span className="text-xs text-gray-500">18 deliveries</span>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">April 2025</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-40 flex items-center justify-center text-gray-400">
                          Bar chart visualization would go here
                        </div>
                        <div className="mt-4 text-center">
                          <div className="text-2xl font-bold">326,000 TZS</div>
                          <div className="text-sm text-gray-500">Total Monthly Earnings</div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Button variant="outline" className="w-full" asChild>
                      <a href="/driver/earnings">
                        View Detailed Earnings
                        <ChevronRight size={16} className="ml-1" />
                      </a>
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="history">
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Delivery History</h2>
                    
                    <div className="space-y-3 max-h-96 overflow-auto pb-4">
                      {completedDeliveries.map((delivery) => (
                        <Card key={delivery.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center mb-1">
                              <h3 className="font-medium">{delivery.vendorName}</h3>
                              <span className="text-primary-500 font-medium">{delivery.fare.toLocaleString()} TZS</span>
                            </div>
                            <div className="text-sm text-gray-500 mb-2">To: {delivery.customerName}</div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center text-sm">
                                <Clock size={14} className="mr-1" />
                                {delivery.completedAt}
                              </div>
                              <div className={`px-2 py-0.5 rounded-full text-xs ${
                                delivery.status === 'completed' 
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                              }`}>
                                {delivery.status === 'completed' ? 'Completed' : 'Cancelled'}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    <Button variant="outline" className="w-full" asChild>
                      <a href="/driver/history">
                        View All Deliveries
                        <ChevronRight size={16} className="ml-1" />
                      </a>
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </div>
      
      <Dialog open={showPickupDetails} onOpenChange={setShowPickupDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pickup Request</DialogTitle>
            <DialogDescription>
              New pickup request from {selectedPickup?.vendorName}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPickup && (
            <div className="py-4 space-y-4">
              <div className="flex items-start">
                <div className="mr-2 mt-1">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <div className="w-0.5 h-8 bg-gray-300 dark:bg-gray-600 mx-auto"></div>
                  <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                </div>
                <div className="flex-1">
                  <p className="font-medium">{selectedPickup.vendorName}</p>
                  <p className="text-gray-500 text-sm mb-4">{selectedPickup.vendorLocation}</p>
                  <p className="font-medium">Customer Location</p>
                  <p className="text-gray-500 text-sm">{selectedPickup.customerLocation}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-sm text-gray-500">Distance</div>
                  <div className="font-medium">{selectedPickup.distance.toFixed(1)} km</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Items</div>
                  <div className="font-medium">{selectedPickup.items}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Fare</div>
                  <div className="font-medium">{selectedPickup.estimatedFare.toLocaleString()} TZS</div>
                </div>
              </div>
              
              <div className="pt-2 text-center text-xs text-gray-500">
                You have 30 seconds to accept this request
              </div>
            </div>
          )}
          
          <DialogFooter className="flex space-x-2">
            <Button variant="outline" onClick={rejectPickup} className="flex-1">
              <XCircle size={16} className="mr-1" />
              Decline
            </Button>
            <Button onClick={acceptPickup} className="flex-1">
              <Check size={16} className="mr-1" />
              Accept
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default DriverDashboard;
