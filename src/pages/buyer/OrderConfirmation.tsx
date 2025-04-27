
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Layout from '@/components/layout/Layout';
import { ChevronLeft, CreditCard, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data
const selectedVendor = {
  id: '1',
  name: 'Mazao Fresh Farm',
  rating: 4.8,
  distance: 1.2,
};

const selectedItems = [
  { id: '1', name: 'Tomatoes', price: 3000, unit: 'kg', quantity: 2 },
  { id: '2', name: 'Onions', price: 2500, unit: 'kg', quantity: 1 },
  { id: '3', name: 'Maize', price: 2000, unit: 'kg', quantity: 3 },
];

const paymentMethods = [
  { id: '1', name: 'M-Pesa', icon: 'mpesa' },
  { id: '2', name: 'Airtel Money', icon: 'airtel' },
  { id: '3', name: 'Credit Card', icon: 'card' },
  { id: '4', name: 'Cash', icon: 'cash' },
];

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('1');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('123 Uhuru Street, Dar es Salaam');
  const [notes, setNotes] = useState<string>('');
  
  // Calculate totals
  const subtotal = selectedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryFee = 2000;
  const serviceFee = 1000;
  const total = subtotal + deliveryFee + serviceFee;

  const handlePlaceOrder = () => {
    setIsLoading(true);
    
    // Mock API call to place order
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Order Placed Successfully",
        description: "A driver will be assigned to your order shortly.",
      });
      navigate('/buyer/tracking');
    }, 1500);
  };

  return (
    <Layout userType="buyer">
      <div className="container max-w-lg py-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft size={18} />
          </Button>
          <h1 className="text-xl font-bold">Order Confirmation</h1>
        </div>
        
        <div className="space-y-6">
          {/* Vendor Information */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4">
            <h2 className="font-medium mb-2">Vendor</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{selectedVendor.name}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0" className="text-yellow-400 mr-1">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  {selectedVendor.rating} • {selectedVendor.distance} km away
                </div>
              </div>
              <Button size="sm" variant="outline" asChild>
                <a href={`/vendor/${selectedVendor.id}`}>View Details</a>
              </Button>
            </div>
          </div>
          
          {/* Selected Items */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4">
            <h2 className="font-medium mb-2">Selected Items</h2>
            <div className="space-y-3">
              {selectedItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full flex items-center justify-center text-sm mr-2">
                      {item.quantity}
                    </span>
                    <span>{item.name}</span>
                  </div>
                  <span>{(item.price * item.quantity).toLocaleString()} TZS</span>
                </div>
              ))}
              
              <div className="pt-2 border-t">
                <Button variant="ghost" size="sm" className="text-primary-500" asChild>
                  <a href="/buyer/cart">Edit Items</a>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Delivery Address */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-medium">Delivery Address</h2>
              <Button variant="ghost" size="sm" className="text-primary-500">Change</Button>
            </div>
            
            <div className="flex items-start">
              <MapPin className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
              <div>
                <p>{deliveryAddress}</p>
                <p className="text-sm text-gray-500">Home</p>
              </div>
            </div>
          </div>
          
          {/* Delivery Notes */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4">
            <h2 className="font-medium mb-2">Delivery Notes (Optional)</h2>
            <Textarea
              placeholder="Any specific instructions for delivery?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="resize-none"
            />
          </div>
          
          {/* Payment Method */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4">
            <h2 className="font-medium mb-2">Payment Method</h2>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map((method) => (
                <div 
                  key={method.id}
                  className={`border rounded-lg p-3 flex items-center cursor-pointer ${
                    selectedPaymentMethod === method.id 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                    : 'border-gray-200 dark:border-gray-700'
                  }`}
                  onClick={() => setSelectedPaymentMethod(method.id)}
                >
                  <div className="mr-2">
                    {method.icon === 'mpesa' && (
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white">M</div>
                    )}
                    {method.icon === 'airtel' && (
                      <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-white">A</div>
                    )}
                    {method.icon === 'card' && (
                      <CreditCard className="w-6 h-6 text-blue-500" />
                    )}
                    {method.icon === 'cash' && (
                      <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                          <circle cx="12" cy="12" r="2"></circle>
                          <path d="M6 12h.01M18 12h.01"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                  <span>{method.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4">
            <h2 className="font-medium mb-2">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{subtotal.toLocaleString()} TZS</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>{deliveryFee.toLocaleString()} TZS</span>
              </div>
              <div className="flex justify-between">
                <span>Service Fee</span>
                <span>{serviceFee.toLocaleString()} TZS</span>
              </div>
              <div className="pt-2 border-t flex justify-between font-semibold">
                <span>Total</span>
                <span>{total.toLocaleString()} TZS</span>
              </div>
            </div>
          </div>
          
          {/* Place Order Button */}
          <Button 
            className="w-full"
            onClick={handlePlaceOrder}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Place Order"}
          </Button>
          
          <p className="text-center text-xs text-gray-500">
            By placing this order, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmation;
