
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Check, X, AlertCircle, Pencil, Search, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';

// Mock data
const inventoryItems = [
  { id: '1', name: 'Tomatoes', price: 3000, inStock: 50, unit: 'kg', category: 'vegetables' },
  { id: '2', name: 'Onions', price: 2500, inStock: 30, unit: 'kg', category: 'vegetables' },
  { id: '3', name: 'Maize', price: 2000, inStock: 100, unit: 'kg', category: 'grains' },
  { id: '4', name: 'Potatoes', price: 1800, inStock: 5, unit: 'kg', category: 'vegetables' },
  { id: '5', name: 'Cabbage', price: 1500, inStock: 15, unit: 'each', category: 'vegetables' },
  { id: '6', name: 'Carrots', price: 2200, inStock: 20, unit: 'kg', category: 'vegetables' },
  { id: '7', name: 'Spinach', price: 1200, inStock: 10, unit: 'bunch', category: 'vegetables' },
  { id: '8', name: 'Bananas', price: 6000, inStock: 45, unit: 'dozen', category: 'fruits' },
  { id: '9', name: 'Rice', price: 3500, inStock: 200, unit: 'kg', category: 'grains' },
  { id: '10', name: 'Oranges', price: 7000, inStock: 40, unit: 'dozen', category: 'fruits' },
  { id: '11', name: 'Beans', price: 4000, inStock: 80, unit: 'kg', category: 'legumes' },
  { id: '12', name: 'Cassava', price: 1800, inStock: 60, unit: 'kg', category: 'root crops' },
];

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'vegetables', label: 'Vegetables' },
  { value: 'fruits', label: 'Fruits' },
  { value: 'grains', label: 'Grains' },
  { value: 'legumes', label: 'Legumes' },
  { value: 'root crops', label: 'Root Crops' },
];

const units = ['kg', 'g', 'bunch', 'each', 'dozen', 'liter'];

type InventoryItem = {
  id: string;
  name: string;
  price: number;
  inStock: number;
  unit: string;
  category: string;
};

const VendorInventory: React.FC = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<InventoryItem[]>(inventoryItems);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showAddItemDialog, setShowAddItemDialog] = useState<boolean>(false);
  const [showEditItemDialog, setShowEditItemDialog] = useState<boolean>(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<InventoryItem | null>(null);
  
  const [newItem, setNewItem] = useState<{
    name: string;
    price: number;
    inStock: number;
    unit: string;
    category: string;
  }>({
    name: '',
    price: 0,
    inStock: 0,
    unit: 'kg',
    category: 'vegetables',
  });
  
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });
  
  const handleAddItem = () => {
    const id = (items.length + 1).toString();
    setItems([...items, { id, ...newItem }]);
    setNewItem({
      name: '',
      price: 0,
      inStock: 0,
      unit: 'kg',
      category: 'vegetables',
    });
    setShowAddItemDialog(false);
    
    toast({
      title: "Item Added",
      description: `${newItem.name} has been added to your inventory.`,
    });
  };
  
  const handleSaveEditedItem = () => {
    if (!currentItem) return;
    
    setItems(items.map(item => 
      item.id === currentItem.id ? currentItem : item
    ));
    setShowEditItemDialog(false);
    
    toast({
      title: "Item Updated",
      description: `${currentItem.name} has been updated in your inventory.`,
    });
  };
  
  const handleDeleteItem = () => {
    if (!currentItem) return;
    
    setItems(items.filter(item => item.id !== currentItem.id));
    setShowDeleteConfirmation(false);
    
    toast({
      title: "Item Deleted",
      description: `${currentItem.name} has been removed from your inventory.`,
    });
  };
  
  const openEditItemDialog = (item: InventoryItem) => {
    setCurrentItem(item);
    setShowEditItemDialog(true);
  };
  
  const openDeleteConfirmation = (item: InventoryItem) => {
    setCurrentItem(item);
    setShowDeleteConfirmation(true);
  };
  
  return (
    <Layout userType="vendor">
      <div className="container py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Inventory Management</h1>
            <p className="text-gray-500">Manage your products and stock levels</p>
          </div>
          
          <Button onClick={() => setShowAddItemDialog(true)}>
            <Plus size={18} className="mr-1" />
            Add New Item
          </Button>
        </div>
        
        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search items..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="text-sm text-gray-500 flex items-center justify-end">
                Showing {filteredItems.length} of {items.length} items
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Inventory Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-6 gap-4 p-4 font-medium text-sm border-b">
            <div>Item</div>
            <div>Category</div>
            <div>Price</div>
            <div>Stock</div>
            <div>Unit</div>
            <div>Actions</div>
          </div>
          
          {filteredItems.length > 0 ? (
            <>
              {filteredItems.map((item) => (
                <div 
                  key={item.id} 
                  className="grid grid-cols-6 gap-4 p-4 text-sm border-b hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <div className="font-medium">{item.name}</div>
                  <div className="capitalize">{item.category}</div>
                  <div>{item.price.toLocaleString()} TZS</div>
                  <div className={item.inStock < 10 ? 'text-amber-500 font-medium' : ''}>
                    {item.inStock < 10 && <AlertCircle size={14} className="inline mr-1" />}
                    {item.inStock}
                  </div>
                  <div>{item.unit}</div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEditItemDialog(item)}>
                      <Pencil size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500" onClick={() => openDeleteConfirmation(item)}>
                      <X size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No items found</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => {
                  setSearchQuery('');
                  setFilterCategory('all');
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Add Item Dialog */}
      <Dialog open={showAddItemDialog} onOpenChange={setShowAddItemDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
            <DialogDescription>
              Add a new product to your inventory
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Item Name</Label>
              <Input 
                id="name" 
                value={newItem.name} 
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="e.g. Fresh Tomatoes"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={newItem.category}
                onValueChange={(value) => setNewItem({ ...newItem, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.slice(1).map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price (TZS)</Label>
                <Input 
                  id="price" 
                  type="number"
                  value={newItem.price} 
                  onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                  min={0}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="unit">Unit</Label>
                <Select 
                  value={newItem.unit}
                  onValueChange={(value) => setNewItem({ ...newItem, unit: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map(unit => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="stock">Initial Stock</Label>
              <Input 
                id="stock" 
                type="number"
                value={newItem.inStock} 
                onChange={(e) => setNewItem({ ...newItem, inStock: Number(e.target.value) })}
                min={0}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddItemDialog(false)}>Cancel</Button>
            <Button onClick={handleAddItem}>Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Item Dialog */}
      <Dialog open={showEditItemDialog} onOpenChange={setShowEditItemDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          
          {currentItem && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Item Name</Label>
                <Input 
                  id="edit-name" 
                  value={currentItem.name} 
                  onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select 
                  value={currentItem.category}
                  onValueChange={(value) => setCurrentItem({ ...currentItem, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.slice(1).map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-price">Price (TZS)</Label>
                  <Input 
                    id="edit-price" 
                    type="number"
                    value={currentItem.price} 
                    onChange={(e) => setCurrentItem({ ...currentItem, price: Number(e.target.value) })}
                    min={0}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-unit">Unit</Label>
                  <Select 
                    value={currentItem.unit}
                    onValueChange={(value) => setCurrentItem({ ...currentItem, unit: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map(unit => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-stock">Stock</Label>
                <Input 
                  id="edit-stock" 
                  type="number"
                  value={currentItem.inStock} 
                  onChange={(e) => setCurrentItem({ ...currentItem, inStock: Number(e.target.value) })}
                  min={0}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditItemDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveEditedItem}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {currentItem?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirmation(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteItem}>Delete Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default VendorInventory;
