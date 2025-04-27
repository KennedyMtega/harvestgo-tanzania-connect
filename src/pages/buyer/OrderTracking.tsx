
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Map, { Marker } from '@/components/shared/Map';
import Layout from '@/components/layout/Layout';
import { PhoneCall, MessageSquare, X, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data
const orderDetails = {
  id: 'ORD1234567',
  status: 'in_progress', // pending, accepted, picked_up, in_progress, delivered, cancelled
  vendor: {
    id: '1',
    name: 'Mazao Fresh Farm',
    address: '123 Samora Avenue, Dar es Salaam',
    position: [39.2183, -6.7824] as [number, number],
  },
  delivery: {
    address: '456 Uhuru Street, Dar es Salaam',
    position: [39.2383, -6.8124] as [number, number],
  },
  driver: {
    id: '1',
    name: 'Ahmed Mohammed',
    phone: '+255712345678',
    photo: null,
    vehicle: 'Motorcycle',
    rating: 4.9,
    position: [39.2283, -6.7924] as [number, number],
  },
  items: [
    { id: '1', name: 'Tomatoes', price: 3000, unit: 'kg', quantity: 2 },
    { id: '2', name: 'Onions', price: 2500, unit: 'kg', quantity: 1 },
    { id: '3', name: 'Maize', price: 2000, unit: 'kg', quantity: 3 },
  ],
  payment: {
    method: 'M-Pesa',
    total: 15500,
  },
  timeline: [
    { status: 'order_placed', time: '10:30 AM', completed: true },
    { status: 'vendor_accepted', time: '10:32 AM', completed: true },
    { status: 'driver_assigned', time: '10:35 AM', completed: true },
    { status: 'driver_picked_up', time: '10:45 AM', completed: false },
    { status: 'out_for_delivery', time: '', completed: false },
    { status: 'delivered', time: '', completed: false },
  ],
};

const OrderTracking = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<string>(orderDetails.status);
  const [eta, setEta] = useState<string>('15-20');
  const [showDetails, setShowDetails] = useState<boolean>(false);
  
  // Simulate order progress
  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];
    
    if (status === 'in_progress') {
      // Simulate driver approaching
      const timeout1 = setTimeout(() => {
        setEta('10-15');
      }, 10000); // 10 seconds
      
      const timeout2 = setTimeout(() => {
        setEta('5-10');
      }, 20000); // 20 seconds
      
      const timeout3 = setTimeout(() => {
        setStatus('delivered');
        toast({
          title: "Order Delivered",
          description: "Your order has been delivered. Enjoy your fresh produce!",
        });
      }, 30000); // 30 seconds
      
      timeouts.push(timeout1, timeout2, timeout3);
    }
    
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [status, toast]);

  const getStatusLabel = () => {
    switch (status) {
      case 'pending':
        return 'Waiting for vendor to accept';
      case 'accepted':
        return 'Order accepted, finding a driver';
      case 'picked_up':
        return 'Driver picked up your order';
      case 'in_progress':
        return 'Driver is on the way';
      case 'delivered':
        return 'Order delivered';
      case 'cancelled':
        return 'Order cancelled';
      default:
        return '';
    }
  };
  
  const getMarkers = (): Marker[] => {
    const markers: Marker[] = [];
    
    if (orderDetails.vendor) {
      markers.push({
        id: `vendor-${orderDetails.vendor.id}`,
        position: orderDetails.vendor.position,
        type: 'vendor'
      });
    }
    
    if (status !== 'pending' && status !== 'accepted' && orderDetails.driver) {
      markers.push({
        id: `driver-${orderDetails.driver.id}`,
        position: orderDetails.driver.position,
        type: 'driver'
      });
    }
    
    markers.push({
      id: 'buyer',
      position: orderDetails.delivery.position,
      type: 'buyer'
    });
    
    return markers;
  };

  const cancelOrder = () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      // Mock API call to cancel order
      setTimeout(() => {
        setStatus('cancelled');
        toast({
          title: "Order Cancelled",
          description: "Your order has been cancelled successfully.",
        });
        navigate('/buyer/orders');
      }, 1000);
    }
  };

  return (
    <Layout userType="buyer" hideFooter>
      <div className="h-screen flex flex-col">
        <div className="flex-1 relative">
          <Map 
            markers={getMarkers()}
            center={orderDetails.driver ? orderDetails.driver.position : orderDetails.vendor.position}
          />
          
          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 bg-background/90 backdrop-blur-md p-4 shadow-md">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h2 className="font-semibold">Order #{orderDetails.id}</h2>
                <p className="text-sm text-gray-500">{orderDetails.vendor.name}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full"
                onClick={() => navigate('/buyer/orders')}
              >
                <X size={20} />
              </Button>
            </div>
            
            <div className="flex items-center">
              <div className={`h-2 flex-1 rounded-full ${
                status === 'delivered' 
                  ? 'bg-green-500' 
                  : status === 'cancelled'
                  ? 'bg-red-500'
                  : 'bg-primary-500'
              }`}>
                <div className="h-full bg-gray-200 dark:bg-gray-700 rounded-full" style={{
                  width: status === 'pending' ? '80%' 
                    : status === 'accepted' ? '60%' 
                    : status === 'picked_up' ? '40%' 
                    : status === 'in_progress' ? '20%' 
                    : '0%'
                }}></div>
              </div>
            </div>
            
            <div className="flex justify-between mt-2 text-sm">
              <div>
                <span className="font-medium">{getStatusLabel()}</span>
              </div>
              {status === 'in_progress' && (
                <div className="flex items-center text-primary-700 dark:text-primary-300">
                  <Clock size={16} className="mr-1" />
                  <span>ETA: {eta} mins</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Driver Info Card */}
          {(status === 'picked_up' || status === 'in_progress') && orderDetails.driver && (
            <div className="absolute top-28 left-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full mr-3 flex-shrink-0">
                    {/* Driver photo placeholder */}
                  </div>
                  <div>
                    <h3 className="font-medium">{orderDetails.driver.name}</h3>
                    <p className="text-sm text-gray-500">{orderDetails.driver.vehicle} • {orderDetails.driver.rating} ⭐</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button size="icon" variant="outline" className="rounded-full">
                    <MessageSquare size={18} />
                  </Button>
                  <Button size="icon" variant="outline" className="rounded-full">
                    <PhoneCall size={18} />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Bottom Sheet */}
        <div className="bg-white dark:bg-gray-800 rounded-t-xl shadow-lg">
          <div className="p-4">
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setShowDetails(!showDetails)}
            >
              <h2 className="font-semibold">Order Details</h2>
              <Button variant="ghost" size="sm" className="rounded-full">
                {showDetails ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
              </Button>
            </div>
            
            {showDetails && (
              <div className="mt-4 space-y-4">
                {/* Order Timeline */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Order Timeline</h3>
                  <div className="space-y-3">
                    {orderDetails.timeline.map((item, index) => (
                      <div key={index} className="flex items-start">
                        <div className="mr-3 mt-1">
                          <div className={`w-4 h-4 rounded-full ${
                            item.completed ? 'bg-primary-500' : 'border-2 border-gray-300 dark:border-gray-600'
                          }`}></div>
                          {index < orderDetails.timeline.length - 1 && (
                            <div className="w-0.5 h-6 bg-gray-200 dark:bg-gray-700 ml-[7px]"></div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {item.status === 'order_placed' && 'Order Placed'}
                            {item.status === 'vendor_accepted' && 'Vendor Accepted'}
                            {item.status === 'driver_assigned' && 'Driver Assigned'}
                            {item.status === 'driver_picked_up' && 'Order Picked Up'}
                            {item.status === 'out_for_delivery' && 'Out for Delivery'}
                            {item.status === 'delivered' && 'Delivered'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.time || 'Upcoming'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Order Items */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Items</h3>
                  <div className="space-y-2">
                    {orderDetails.items.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.name}</span>
                        <span>{(item.price * item.quantity).toLocaleString()} TZS</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Payment Info */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Payment</h3>
                  <div className="flex justify-between text-sm">
                    <span>Payment Method</span>
                    <span>{orderDetails.payment.method}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold">
                    <span>Total</span>
                    <span>{orderDetails.payment.total.toLocaleString()} TZS</span>
                  </div>
                </div>
                
                {/* Addresses */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Addresses</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="font-medium">Pickup Address:</p>
                      <p className="text-gray-500">{orderDetails.vendor.address}</p>
                    </div>
                    <div>
                      <p className="font-medium">Delivery Address:</p>
                      <p className="text-gray-500">{orderDetails.delivery.address}</p>
                    </div>
                  </div>
                </div>
                
                {/* Cancellation Button */}
                {(status === 'pending' || status === 'accepted') && (
                  <Button 
                    variant="outline" 
                    className="w-full border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                    onClick={cancelOrder}
                  >
                    Cancel Order
                  </Button>
                )}
                
                {/* Support Button */}
                <Button variant="outline" className="w-full" asChild>
                  <a href="/support">Contact Support</a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderTracking;
