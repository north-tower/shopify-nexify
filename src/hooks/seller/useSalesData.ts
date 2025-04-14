
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useSalesData = (sellerId: string | null) => {
  const { data: salesData, isLoading: isLoadingSales } = useQuery({
    queryKey: ['sales', sellerId],
    queryFn: async () => {
      if (!sellerId) return null;
      const { data } = await supabase
        .from('sales')
        .select(`
          sale_amount,
          quantity,
          created_at,
          products (
            product_name,
            id
          )
        `)
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: false });
      return data;
    },
    enabled: !!sellerId
  });

  const { data: productsCount } = useQuery({
    queryKey: ['products-count', sellerId],
    queryFn: async () => {
      if (!sellerId) return 0;
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('seller_id', sellerId);
      return count || 0;
    },
    enabled: !!sellerId
  });

  const { data: topProducts, isLoading: isLoadingTopProducts } = useQuery({
    queryKey: ['top-products', sellerId],
    queryFn: async () => {
      if (!sellerId) return null;
      const { data } = await supabase
        .from('sales')
        .select(`
          product_id,
          products (
            product_name,
            price,
            photo_url
          ),
          quantity,
          sale_amount
        `)
        .eq('seller_id', sellerId)
        .order('sale_amount', { ascending: false })
        .limit(5);

      // Aggregate sales by product
      const productMap = new Map();
      data?.forEach((sale) => {
        const productId = sale.product_id;
        if (productMap.has(productId)) {
          const existing = productMap.get(productId);
          productMap.set(productId, {
            ...existing,
            totalSales: existing.totalSales + Number(sale.sale_amount),
            totalQuantity: existing.totalQuantity + sale.quantity
          });
        } else {
          productMap.set(productId, {
            id: productId,
            name: sale.products?.product_name || 'Unknown Product',
            price: sale.products?.price || 0,
            image: sale.products?.photo_url || null,
            totalSales: Number(sale.sale_amount),
            totalQuantity: sale.quantity
          });
        }
      });
      
      return Array.from(productMap.values());
    },
    enabled: !!sellerId
  });

  // Get monthly sales data for analytics
  const { data: monthlySalesData, isLoading: isLoadingMonthlySales } = useQuery({
    queryKey: ['monthly-sales', sellerId],
    queryFn: async () => {
      if (!sellerId) return null;
      
      // Get data from the last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      
      const { data } = await supabase
        .from('sales')
        .select(`
          sale_amount,
          created_at
        `)
        .eq('seller_id', sellerId)
        .gte('created_at', sixMonthsAgo.toISOString())
        .order('created_at', { ascending: true });
      
      // Aggregate sales by month
      const monthlySales = new Map();
      data?.forEach(sale => {
        const date = new Date(sale.created_at);
        const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
        
        if (monthlySales.has(monthYear)) {
          monthlySales.set(monthYear, {
            ...monthlySales.get(monthYear),
            amount: monthlySales.get(monthYear).amount + Number(sale.sale_amount)
          });
        } else {
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          monthlySales.set(monthYear, {
            name: `${monthNames[date.getMonth()]} ${date.getFullYear()}`,
            amount: Number(sale.sale_amount),
            month: date.getMonth(),
            year: date.getFullYear()
          });
        }
      });
      
      // Convert to array and sort by date
      return Array.from(monthlySales.values()).sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
      });
    },
    enabled: !!sellerId
  });

  // Calculate derived data
  const totalSales = salesData?.reduce((sum, sale) => sum + Number(sale.sale_amount), 0) || 0;
  const totalOrders = salesData?.length || 0;
  const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

  const chartData = salesData?.slice(0, 7).map(sale => ({
    name: new Date(sale.created_at).toLocaleDateString(),
    amount: Number(sale.sale_amount)
  })).reverse() || [];

  // Prepare data for pie chart
  const categoryData = topProducts
    ? Array.from(
        topProducts.reduce((map, product) => {
          const category = product.name.split(' ')[0]; // Just using first word as mock category
          const currentValue = map.get(category) || 0;
          map.set(category, currentValue + product.totalSales);
          return map;
        }, new Map())
      ).map(([name, value]) => ({ name, value }))
    : [];

  return {
    salesData,
    isLoadingSales,
    productsCount,
    topProducts,
    isLoadingTopProducts,
    monthlySalesData,
    isLoadingMonthlySales,
    totalSales,
    totalOrders,
    averageOrderValue,
    chartData,
    categoryData
  };
};
