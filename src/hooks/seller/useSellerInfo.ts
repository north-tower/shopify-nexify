
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useSellerInfo = () => {
  const [sellerId, setSellerId] = useState<string | null>(null);
  const [sellerName, setSellerName] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchSellerInfo = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('sellers')
          .select('id, business_name')
          .eq('user_id', user.id)
          .single();
        if (data) {
          setSellerId(data.id);
          setSellerName(data.business_name);
        }
      }
    };
    fetchSellerInfo();
  }, []);

  const refreshData = () => {
    toast({
      title: "Dashboard Refreshed",
      description: "Your dashboard data has been updated with the latest information.",
    });
  };

  return { sellerId, sellerName, refreshData };
};
