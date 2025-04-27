
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Bell, Clock, Check, X, ChevronRight, AlertCircle } from 'lucide-react';

// Mock data
const pendingOrders = [
  {
    id: 'ORD7654321',
    time: '11:45 AM',
    items: [
      { id: '1', name: 'Tomatoes', quantity: 3 },
      { id: '2', name: 'Onions', quantity: 2 },
      { id: '5', name: 'Cabbage', quantity: 1 },
    ],
    total: 13500,
    customer: {
      name: 'John Doe',
      rating: 4.7,
    }
  },
  {
    id: 'ORD7654322',
    time: '11:52 AM',
    items: [
      { id: '3', name: 'Maize', quantity: 5 },
      { id: '4', name: 'Potatoes', quantity: 2 },
    ],
    total: 14000,
    customer: {
      name: 'Sarah Johnson',
      rating: 4.9,
    }
  },
];

const activeOrders = [
  {
    id: 'ORD7654320',
    status: 'preparing', // preparing, ready, picked_up
    time: '11:30 AM',
    items: [
      { id: '1', name: 'Tomatoes', quantity: 2 },
      { id: '4', name: 'Potatoes', quantity: 3 },
    ],
    total: 12000,
    customer: {
      name: 'Mary Smith',
      rating: 4.5,
    },
    driver: {
      name: 'Ahmed Mohammed',
      eta: '5-10',
      rating: 4.9,
    }
  },
];

const recentOrders = [
  {
    id: 'ORD7654319',
    status: 'completed',
    time: '10:15 AM',
    items: [
      { id: '2', name: 'Onions', quantity: 4 },
      { id: '3', name: 'Maize', quantity: 2 },
    ],
    total: 15000,
    customer: {
      name: 'David Williams',
      rating: 4.8,
    }
  },
  {
    id: 'ORD7654318',
    status: 'completed',
    time: '9:22 AM',
    items: [
      { id: '1', name: 'Tomatoes', quantity: 3 },
      { id: '5', name: 'Cabbage', quantity: 2 },
      { id: '6', name: 'Carrots', quantity: 1 },
    ],
    total: 18500,
    customer: {
      name: 'Michael Brown',
      rating: 4.6,
    }
  },
  {
    id: 'ORD7654317',
    status: 'cancelled',
    time: '8:45 AM',
    items: [
      { id: '4', name: 'Potatoes', quantity: 5 },
    ],
    total: 9000,
    customer: {
      name: 'Lisa Taylor',
      rating: 4.3,
    }
  },
];

const inventoryItems = [
  { id: '1', name: 'Tomatoes', price: 3000, inStock: 50, unit: 'kg' },
  { id: '2', name: 'Onions', price: 2500, inStock: 30, unit: 'kg' },
  { id: '3', name: 'Maize', price: 2000, inStock: 100, unit: 'kg' },
  { id: '4', name: 'Potatoes', price: 1800, inStock: 25, unit: 'kg' },
  { id: '5', name: 'Cabbage', price: 1500, inStock: 15, unit: 'each' },
  { id: '6', name: 'Carrots', price: 2200, inStock: 20, unit: 'kg' },
  { id: '7', name: 'Spinach', price: 1200, inStock: 10, unit: 'bunch' },
  { id: '8', name: 'Bananas', price: 6000, inStock: 5, unit: 'dozen' },
];

const VendorDashboard: React.FC = () => {
  const { toast } = useToast();
  const [todayEarnings, setTodayEarnings] = useState(33500);
  const [monthlyEarnings, setMonthlyEarnings] = useState(950000);
  const [selectedTab, setSelectedTab] = useState('orders');
  const [onlineStatus, setOnlineStatus] = useState(true);
  
  const handleToggleStatus = () => {
    setOnlineStatus(!onlineStatus);
    toast({
      title: onlineStatus ? "Status Changed" : "You're back online",
      description: onlineStatus ? "You are now offline. You won't receive new orders." : "You are now online and accepting orders.",
    });
  };
  
  const handleAcceptOrder = (orderId: string) => {
    // Mock API call to accept order
    toast({
      title: "Order Accepted",
      description: `You've accepted order #${orderId}. Please prepare the items.`,
    });
    // In a real app, we would update the order list
  };
  
  const handleDeclineOrder = (orderId: string) => {
    // Mock API call to decline order
    toast({
      title: "Order Declined",
      description: `You've declined order #${orderId}.`,
    });
    // In a real app, we would remove the order from the list
  };
  
  const handleOrderReady = (orderId: string) => {
    // Mock API call to mark order as ready
    toast({
      title: "Order Ready",
      description: `Order #${orderId} is now marked as ready for pickup.`,
    });
    // In a real app, we would update the order status
  };
  
  return (
    <Layout userType="vendor">
      <div className="container py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Vendor Dashboard</h1>
            <p className="text-gray-500">Manage your inventory and orders</p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm">
              {onlineStatus ? 'Online' : 'Offline'}
            </span>
            <Button 
              variant={onlineStatus ? "default" : "outline"} 
              onClick={handleToggleStatus}
            >
              {onlineStatus ? 'Go Offline' : 'Go Online'}
            </Button>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Today's Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayEarnings.toLocaleString()} TZS</div>
              <p className="text-xs text-gray-500">From 5 orders</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Monthly Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{monthlyEarnings.toLocaleString()} TZS</div>
              <p className="text-xs text-gray-500">April 2025</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Vendor Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center">
                4.7
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="text-yellow-400 ml-1">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </div>
              <p className="text-xs text-gray-500">Based on 145 reviews</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content Tabs */}
        <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="orders" className="space-y-6">
            {/* Pending Orders */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Pending Orders ({pendingOrders.length})</h2>
              {pendingOrders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingOrders.map((order) => (
                    <Card key={order.id} className="border-l-4 border-l-secondary-500">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle className="text-base">Order #{order.id}</CardTitle>
                            <CardDescription>
                              <div className="flex items-center">
                                <Clock size={14} className="mr-1" />
                                {order.time}
                              </div>
                            </CardDescription>
                          </div>
                          <div className="flex items-center">
                            <div className="bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300 px-2 py-1 rounded text-xs font-medium">
                              New Order
                            </div>
                            <Bell className="ml-2 text-secondary-500 animate-pulse" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-1">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span>{item.quantity}x {item.name}</span>
                            </div>
                          ))}
                          <div className="pt-2 flex justify-between font-medium">
                            <span>Total:</span>
                            <span>{order.total.toLocaleString()} TZS</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500"
                          onClick={() => handleDeclineOrder(order.id)}
                        >
                          <X size={16} className="mr-1" />
                          Decline
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleAcceptOrder(order.id)}
                        >
                          <Check size={16} className="mr-1" />
                          Accept
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-gray-500">No pending orders at the moment</p>
                </div>
              )}
            </div>
            
            {/* Active Orders */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Active Orders ({activeOrders.length})</h2>
              {activeOrders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeOrders.map((order) => (
                    <Card key={order.id} className="border-l-4 border-l-primary-500">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle className="text-base">Order #{order.id}</CardTitle>
                            <CardDescription>
                              <div className="flex items-center">
                                <Clock size={14} className="mr-1" />
                                {order.time}
                              </div>
                            </CardDescription>
                          </div>
                          <div className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-1 rounded text-xs font-medium">
                            {order.status === 'preparing' && 'Preparing'}
                            {order.status === 'ready' && 'Ready for Pickup'}
                            {order.status === 'picked_up' && 'Picked Up'}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-1">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span>{item.quantity}x {item.name}</span>
                            </div>
                          ))}
                          <div className="pt-2 flex justify-between font-medium">
                            <span>Total:</span>
                            <span>{order.total.toLocaleString()} TZS</span>
                          </div>
                          {order.status === 'preparing' && order.driver && (
                            <div className="pt-2 text-sm">
                              <span className="text-gray-500">Driver ETA: {order.driver.eta} minutes</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          asChild
                        >
                          <a href={`/vendor/orders/${order.id}`}>
                            View Details
                          </a>
                        </Button>
                        {order.status === 'preparing' && (
                          <Button 
                            size="sm"
                            onClick={() => handleOrderReady(order.id)}
                          >
                            Mark as Ready
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-gray-500">No active orders at the moment</p>
                </div>
              )}
            </div>
            
            {/* Recent Orders */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <div className="grid grid-cols-4 gap-4 p-4 font-medium text-sm border-b">
                  <div>Order ID</div>
                  <div>Items</div>
                  <div>Total</div>
                  <div>Status</div>
                </div>
                {recentOrders.map((order) => (
                  <div 
                    key={order.id} 
                    className="grid grid-cols-4 gap-4 p-4 text-sm border-b hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => window.location.href = `/vendor/orders/${order.id}`}
                  >
                    <div className="font-medium">#{order.id}</div>
                    <div>{order.items.reduce((total, item) => total + item.quantity, 0)} items</div>
                    <div>{order.total.toLocaleString()} TZS</div>
                    <div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'completed' 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                      }`}>
                        {order.status === 'completed' ? 'Completed' : 'Cancelled'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline" asChild>
                  <a href="/vendor/orders">
                    View All Orders
                    <ChevronRight size={16} className="ml-1" />
                  </a>
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="inventory">
            {/* Inventory Management */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Inventory Items ({inventoryItems.length})</h2>
                <Button asChild>
                  <a href="/vendor/inventory/add">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Add Item
                  </a>
                </Button>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <div className="grid grid-cols-5 gap-4 p-4 font-medium text-sm border-b">
                  <div>Name</div>
                  <div>Price</div>
                  <div>In Stock</div>
                  <div>Unit</div>
                  <div></div>
                </div>
                {inventoryItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="grid grid-cols-5 gap-4 p-4 text-sm border-b hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <div className="font-medium">{item.name}</div>
                    <div>{item.price.toLocaleString()} TZS</div>
                    <div className={item.inStock < 10 ? 'text-amber-500 font-medium' : ''}>
                      {item.inStock < 10 && <AlertCircle size={14} className="inline mr-1" />}
                      {item.inStock} {item.unit}
                    </div>
                    <div>{item.unit}</div>
                    <div>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={`/vendor/inventory/edit/${item.id}`}>
                          Edit
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics">
            {/* Analytics Dashboard */}
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Most Popular Item</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold">Tomatoes</div>
                    <p className="text-xs text-gray-500">Sold 124 kg this month</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Total Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold">235</div>
                    <p className="text-xs text-green-500">↑ 12% from last month</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Avg. Order Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold">12,500 TZS</div>
                    <p className="text-xs text-green-500">↑ 5% from last month</p>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Sales</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <div className="flex justify-center items-center h-full text-gray-400">
                    Bar chart visualization would go here
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Selling Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Tomatoes</span>
                        <div className="w-1/2 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div className="bg-primary-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                        <span className="text-sm">124 kg</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Onions</span>
                        <div className="w-1/2 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div className="bg-primary-500 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <span className="text-sm">98 kg</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Potatoes</span>
                        <div className="w-1/2 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div className="bg-primary-500 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                        <span className="text-sm">83 kg</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Maize</span>
                        <div className="w-1/2 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div className="bg-primary-500 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                        <span className="text-sm">62 kg</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Demographics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center items-center h-40 text-gray-400">
                      Pie chart visualization would go here
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="text-center">
                        <div className="text-lg font-bold">75%</div>
                        <div className="text-sm text-gray-500">Repeat Customers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold">25%</div>
                        <div className="text-sm text-gray-500">New Customers</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default VendorDashboard;
