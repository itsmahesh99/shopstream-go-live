
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingBag } from "lucide-react";

const OrdersTabs = () => {
  return (
    <div className="px-4 mb-6">
      <h3 className="font-medium mb-3">My Orders</h3>
      <Tabs defaultValue="to-pay" className="w-full">
        <TabsList className="grid grid-cols-4 w-full bg-gray-100 p-1">
          <TabsTrigger value="to-pay" className="text-xs">To Pay</TabsTrigger>
          <TabsTrigger value="to-ship" className="text-xs">To Ship</TabsTrigger>
          <TabsTrigger value="to-receive" className="text-xs">To Receive</TabsTrigger>
          <TabsTrigger value="to-review" className="text-xs">To Review</TabsTrigger>
        </TabsList>
        <TabsContent value="to-pay" className="mt-2">
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="flex flex-col items-center justify-center py-6">
              <ShoppingBag className="h-12 w-12 text-gray-300 mb-2" />
              <p className="text-gray-500 text-sm">No orders waiting for payment</p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="to-ship" className="mt-2">
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="flex flex-col items-center justify-center py-6">
              <ShoppingBag className="h-12 w-12 text-gray-300 mb-2" />
              <p className="text-gray-500 text-sm">No orders waiting to ship</p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="to-receive" className="mt-2">
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="flex flex-col items-center justify-center py-6">
              <ShoppingBag className="h-12 w-12 text-gray-300 mb-2" />
              <p className="text-gray-500 text-sm">No orders to receive</p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="to-review" className="mt-2">
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="flex flex-col items-center justify-center py-6">
              <ShoppingBag className="h-12 w-12 text-gray-300 mb-2" />
              <p className="text-gray-500 text-sm">No orders to review</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrdersTabs;
