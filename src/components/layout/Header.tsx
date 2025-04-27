
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, X, Bell, User } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface HeaderProps {
  userType?: 'buyer' | 'vendor' | 'driver' | null;
}

const Header: React.FC<HeaderProps> = ({ userType = null }) => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">H</span>
            </div>
            <span className="font-heading font-bold text-xl">HarvestGo</span>
          </Link>
        </div>

        {isMobile ? (
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] md:w-[350px]">
              <div className="flex flex-col gap-4 py-4">
                <MobileMenuItems userType={userType} />
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <div className="hidden md:flex items-center gap-6">
            <DesktopMenuItems userType={userType} />
          </div>
        )}
      </div>
    </header>
  );
};

const MobileMenuItems: React.FC<HeaderProps> = ({ userType }) => {
  if (!userType) {
    return (
      <>
        <Link to="/login" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">Login</Link>
        <Link to="/register" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">Register</Link>
        <div className="py-2 border-t border-border">
          <div className="flex justify-between items-center px-4 py-2">
            <span>Language</span>
            <div className="flex space-x-2">
              <button className="px-2 py-1 text-sm rounded-md bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300">EN</button>
              <button className="px-2 py-1 text-sm rounded-md">SW</button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (userType === 'buyer') {
    return (
      <>
        <Link to="/buyer/profile" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">Profile</Link>
        <Link to="/buyer/orders" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">My Orders</Link>
        <Link to="/buyer/settings" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">Settings</Link>
        <Link to="/logout" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md text-destructive">Logout</Link>
      </>
    );
  }

  if (userType === 'vendor') {
    return (
      <>
        <Link to="/vendor/dashboard" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">Dashboard</Link>
        <Link to="/vendor/inventory" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">Inventory</Link>
        <Link to="/vendor/orders" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">Orders</Link>
        <Link to="/vendor/settings" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">Settings</Link>
        <Link to="/logout" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md text-destructive">Logout</Link>
      </>
    );
  }

  if (userType === 'driver') {
    return (
      <>
        <Link to="/driver/dashboard" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">Dashboard</Link>
        <Link to="/driver/earnings" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">Earnings</Link>
        <Link to="/driver/history" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">History</Link>
        <Link to="/driver/settings" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">Settings</Link>
        <Link to="/logout" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md text-destructive">Logout</Link>
      </>
    );
  }

  return null;
};

const DesktopMenuItems: React.FC<HeaderProps> = ({ userType }) => {
  if (!userType) {
    return (
      <>
        <div className="flex space-x-2">
          <button className="px-2 py-1 text-sm rounded-md bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300">EN</button>
          <button className="px-2 py-1 text-sm rounded-md">SW</button>
        </div>
        <Link to="/login" className="text-sm font-medium">Login</Link>
        <Link to="/register">
          <Button size="sm">Register</Button>
        </Link>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center space-x-1">
        <Link to="/notifications">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
        </Link>
        <Link to={`/${userType}/profile`}>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </>
  );
};

export default Header;
