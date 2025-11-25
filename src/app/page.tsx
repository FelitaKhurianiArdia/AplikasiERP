'use client';

import { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Area, AreaChart, PieChart, Pie, Cell } from 'recharts';

interface Product {
  id: string;
  name: string;
  category: string;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  description: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface Order {
  id: string;
  customerId: string;
  customerName: string;
  productId: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  orderDate: string;
  status: 'pending' | 'completed' | 'cancelled';
}

interface MonthlyRevenue {
  month: string;
  revenue: number;
  orders: number;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'customers' | 'orders' | 'revenue'>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([]);
  
  // Form states
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    category: '',
    purchasePrice: 0,
    sellingPrice: 0,
    stock: 0,
    description: ''
  });
  
  const [newCustomer, setNewCustomer] = useState<Omit<Customer, 'id'>>({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  
  const [newOrder, setNewOrder] = useState<Omit<Order, 'id' | 'totalPrice'>>({
    customerId: '',
    customerName: '',
    productId: '',
    productName: '',
    quantity: 1,
    orderDate: new Date().toISOString().split('T')[0],
    status: 'pending'
  });

  const [stockUpdate, setStockUpdate] = useState<{
    productId: string;
    quantity: number;
    operation: 'add' | 'subtract';
  } | null>(null);

  // Error states
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Format currency
  const formatCurrency = useCallback((amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  }, []);

  // Calculate monthly revenue - moved to useCallback to prevent initialization issues
  const calculateMonthlyRevenue = useCallback((ordersData: Order[]) => {
    const revenueData: { [key: string]: { revenue: number; orders: number } } = {};
    
    ordersData.forEach(order => {
      if (order.status === 'completed') {
        const month = new Date(order.orderDate).toLocaleDateString('id-ID', { 
          year: 'numeric', 
          month: 'long' 
        });
        
        if (!revenueData[month]) {
          revenueData[month] = { revenue: 0, orders: 0 };
        }
        
        revenueData[month].revenue += order.totalPrice;
        revenueData[month].orders += 1;
      }
    });
    
    const monthlyData = Object.entries(revenueData).map(([month, data]) => ({
      month,
      revenue: data.revenue,
      orders: data.orders
    }));
    
    setMonthlyRevenue(monthlyData);
  }, []);

  // Initialize app
  useEffect(() => {
    loadSampleData();
  }, []);

  // Load sample data directly
  const loadSampleData = () => {
    // Sample products
    const sampleProducts: Product[] = [
      {
        id: 'LP-001',
        name: 'MacBook Air M2',
        category: 'PC & Laptop',
        purchasePrice: 15000000,
        sellingPrice: 18000000,
        stock: 7,
        description: 'Laptop tipis dengan chip M2, RAM 8GB, SSD 256GB'
      },
      {
        id: 'HP-055',
        name: 'Samsung Galaxy S23',
        category: 'Smartphone',
        purchasePrice: 8500000,
        sellingPrice: 10999000,
        stock: 13,
        description: 'Smartphone flagship dengan kamera 50MP dan Snapdragon 8 Gen 2'
      },
      {
        id: 'TV-102',
        name: 'Samsung Smart TV 55"',
        category: 'TV & Audio',
        purchasePrice: 7500000,
        sellingPrice: 8999000,
        stock: 5,
        description: 'Smart TV 4K dengan HDR dan voice control'
      },
      {
        id: 'HA-201',
        name: 'LG Refrigerator 2 Pintu',
        category: 'Home Appliance',
        purchasePrice: 4500000,
        sellingPrice: 5499000,
        stock: 2,
        description: 'Kulkas 2 pintu dengan teknologi inverter'
      },
      {
        id: 'LP-002',
        name: 'ASUS ROG Laptop',
        category: 'PC & Laptop',
        purchasePrice: 20000000,
        sellingPrice: 25000000,
        stock: 4,
        description: 'Gaming laptop dengan RTX 4060 dan Intel i7'
      },
      {
        id: 'SP-001',
        name: 'iPhone 15 Pro',
        category: 'Smartphone',
        purchasePrice: 18000000,
        sellingPrice: 22000000,
        stock: 7,
        description: 'iPhone terbaru dengan chip A17 Pro dan titanium body'
      }
    ];

    // Sample customers
    const sampleCustomers: Customer[] = [
      {
        id: 'CUST-001',
        name: 'Ahmad Wijaya',
        email: 'ahmad@email.com',
        phone: '081234567890',
        address: 'Jl. Sudirman No. 123, Jakarta'
      },
      {
        id: 'CUST-002',
        name: 'Siti Nurhaliza',
        email: 'siti@email.com',
        phone: '082345678901',
        address: 'Jl. Thamrin No. 456, Jakarta'
      },
      {
        id: 'CUST-003',
        name: 'Budi Santoso',
        email: 'budi@email.com',
        phone: '083456789012',
        address: 'Jl. Gatot Subroto No. 789, Jakarta'
      },
      {
        id: 'CUST-004',
        name: 'Dewi Lestari',
        email: 'dewi@email.com',
        phone: '084567890123',
        address: 'Jl. MH Thamrin No. 100, Jakarta'
      },
      {
        id: 'CUST-005',
        name: 'Eko Prasetyo',
        email: 'eko@email.com',
        phone: '085678901234',
        address: 'Jl. Rasuna Said No. 200, Jakarta'
      },
      {
        id: 'CUST-006',
        name: 'Fitri Handayani',
        email: 'fitri@email.com',
        phone: '086789012345',
        address: 'Jl. Senayan No. 50, Jakarta'
      },
      {
        id: 'CUST-007',
        name: 'Gunawan Wijaya',
        email: 'gunawan@email.com',
        phone: '087890123456',
        address: 'Jl. Sudirman No. 300, Jakarta'
      },
      {
        id: 'CUST-008',
        name: 'Hana Permata',
        email: 'hana@email.com',
        phone: '088901234567',
        address: 'Jl. Thamrin No. 150, Jakarta'
      }
    ];

    // Sample orders - Mix of completed and pending orders
    const sampleOrders: Order[] = [
      {
        id: 'ORD-001',
        customerId: 'CUST-001',
        customerName: 'Ahmad Wijaya',
        productId: 'LP-001',
        productName: 'MacBook Air M2',
        quantity: 1,
        totalPrice: 18000000,
        orderDate: '2024-01-15',
        status: 'completed'
      },
      {
        id: 'ORD-002',
        customerId: 'CUST-002',
        customerName: 'Siti Nurhaliza',
        productId: 'HP-055',
        productName: 'Samsung Galaxy S23',
        quantity: 2,
        totalPrice: 21998000,
        orderDate: '2024-01-16',
        status: 'completed'
      },
      {
        id: 'ORD-003',
        customerId: 'CUST-003',
        customerName: 'Budi Santoso',
        productId: 'TV-102',
        productName: 'Samsung Smart TV 55"',
        quantity: 1,
        totalPrice: 8999000,
        orderDate: '2024-01-20',
        status: 'pending'
      },
      {
        id: 'ORD-004',
        customerId: 'CUST-004',
        customerName: 'Dewi Lestari',
        productId: 'HA-201',
        productName: 'LG Refrigerator 2 Pintu',
        quantity: 1,
        totalPrice: 5499000,
        orderDate: '2024-02-01',
        status: 'completed'
      },
      {
        id: 'ORD-005',
        customerId: 'CUST-005',
        customerName: 'Eko Prasetyo',
        productId: 'LP-002',
        productName: 'ASUS ROG Laptop',
        quantity: 1,
        totalPrice: 25000000,
        orderDate: '2024-02-10',
        status: 'pending'
      },
      {
        id: 'ORD-006',
        customerId: 'CUST-006',
        customerName: 'Fitri Handayani',
        productId: 'SP-001',
        productName: 'iPhone 15 Pro',
        quantity: 1,
        totalPrice: 22000000,
        orderDate: '2024-03-05',
        status: 'completed'
      }
    ];

    setProducts(sampleProducts);
    setCustomers(sampleCustomers);
    setOrders(sampleOrders);
    
    // Calculate monthly revenue
    calculateMonthlyRevenue(sampleOrders);
  };

  // Calculate statistics
  const completedOrders = orders.filter(order => order.status === 'completed').length;
  const totalRevenue = orders
    .filter(order => order.status === 'completed')
    .reduce((sum, order) => sum + order.totalPrice, 0);
  const averageOrderValue = completedOrders > 0 ? totalRevenue / completedOrders : 0;
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const totalProductsValue = products.reduce((sum, product) => sum + (product.sellingPrice * product.stock), 0);

  // Validation functions
  const validateProduct = () => {
    const newErrors: Record<string, string> = {};
    
    if (!newProduct.name.trim()) {
      newErrors.name = 'Nama produk wajib diisi';
    }
    if (!newProduct.category.trim()) {
      newErrors.category = 'Kategori wajib diisi';
    }
    if (newProduct.sellingPrice <= 0) {
      newErrors.sellingPrice = 'Harga jual harus lebih dari 0';
    }
    if (newProduct.stock < 0) {
      newErrors.stock = 'Stok tidak boleh negatif';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCustomer = () => {
    const newErrors: Record<string, string> = {};
    
    if (!newCustomer.name.trim()) {
      newErrors.name = 'Nama pelanggan wajib diisi';
    }
    if (!newCustomer.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(newCustomer.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    if (!newCustomer.phone.trim()) {
      newErrors.phone = 'Nomor telepon wajib diisi';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOrder = () => {
    const newErrors: Record<string, string> = {};
    
    if (!newOrder.customerId) {
      newErrors.customerId = 'Pelanggan wajib dipilih';
    }
    if (!newOrder.productId) {
      newErrors.productId = 'Produk wajib dipilih';
    }
    if (newOrder.quantity <= 0) {
      newErrors.quantity = 'Jumlah harus lebih dari 0';
    }
    
    // Check stock availability
    if (newOrder.productId && newOrder.quantity > 0) {
      const product = products.find(p => p.id === newOrder.productId);
      if (product && product.stock < newOrder.quantity) {
        newErrors.quantity = `Stok tidak mencukupi. Tersedia: ${product.stock}`;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Product management functions
  const addProduct = () => {
    if (validateProduct()) {
      const product: Product = {
        ...newProduct,
        id: `PRD-${String(products.length + 1).padStart(3, '0')}`
      };
      setProducts([...products, product]);
      setNewProduct({
        name: '',
        category: '',
        purchasePrice: 0,
        sellingPrice: 0,
        stock: 0,
        description: ''
      });
      setShowProductForm(false);
      setErrors({});
    }
  };

  const deleteProduct = (id: string) => {
    // Check if product is used in orders
    const isUsedInOrders = orders.some(order => order.productId === id);
    if (isUsedInOrders) {
      alert('Produk tidak dapat dihapus karena masih digunakan dalam pesanan');
      return;
    }
    
    setProducts(products.filter(product => product.id !== id));
  };

  // Stock management functions
  const updateStock = (productId: string, quantity: number, operation: 'add' | 'subtract') => {
    const updatedProducts = products.map(product => {
      if (product.id === productId) {
        const newStock = operation === 'add' 
          ? product.stock + quantity 
          : Math.max(0, product.stock - quantity);
        
        return { ...product, stock: newStock };
      }
      return product;
    });
    
    setProducts(updatedProducts);
    setStockUpdate(null);
  };

  const openStockUpdate = (productId: string, operation: 'add' | 'subtract') => {
    setStockUpdate({
      productId,
      quantity: 1,
      operation
    });
  };

  // Customer management functions
  const addCustomer = () => {
    if (validateCustomer()) {
      const customer: Customer = {
        ...newCustomer,
        id: `CUST-${String(customers.length + 1).padStart(3, '0')}`
      };
      setCustomers([...customers, customer]);
      setNewCustomer({
        name: '',
        email: '',
        phone: '',
        address: ''
      });
      setShowCustomerForm(false);
      setErrors({});
    }
  };

  const deleteCustomer = (id: string) => {
    // Check if customer is used in orders
    const isUsedInOrders = orders.some(order => order.customerId === id);
    if (isUsedInOrders) {
      alert('Pelanggan tidak dapat dihapus karena masih memiliki pesanan');
      return;
    }
    
    setCustomers(customers.filter(customer => customer.id !== id));
  };

  // Order management functions
  const addOrder = () => {
    if (validateOrder()) {
      const product = products.find(p => p.id === newOrder.productId);
      const customer = customers.find(c => c.id === newOrder.customerId);
      
      if (product && customer) {
        const order: Order = {
          ...newOrder,
          customerName: customer.name,
          productName: product.name,
          totalPrice: product.sellingPrice * newOrder.quantity,
          id: `ORD-${String(orders.length + 1).padStart(3, '0')}`
        };
        
        const updatedOrders = [...orders, order];
        setOrders(updatedOrders);
        
        // Update product stock
        const updatedProducts = products.map(p => 
          p.id === product.id 
            ? { ...p, stock: p.stock - newOrder.quantity }
            : p
        );
        setProducts(updatedProducts);
        
        setNewOrder({
          customerId: '',
          customerName: '',
          productId: '',
          productName: '',
          quantity: 1,
          orderDate: new Date().toISOString().split('T')[0],
          status: 'pending'
        });
        setShowOrderForm(false);
        setErrors({});
        
        // Recalculate monthly revenue
        calculateMonthlyRevenue(updatedOrders);
      }
    }
  };

  const updateOrderStatus = (id: string, status: 'pending' | 'completed' | 'cancelled') => {
    const updatedOrders = orders.map(order => 
      order.id === id ? { ...order, status } : order
    );
    setOrders(updatedOrders);
    calculateMonthlyRevenue(updatedOrders);
  };

  const deleteOrder = (id: string) => {
    const orderToDelete = orders.find(order => order.id === id);
    if (!orderToDelete) return;
    
    // Restore product stock if order is not cancelled
    if (orderToDelete.status !== 'cancelled') {
      const updatedProducts = products.map(p => 
        p.id === orderToDelete.productId 
          ? { ...p, stock: p.stock + orderToDelete.quantity }
          : p
      );
      setProducts(updatedProducts);
    }
    
    const updatedOrders = orders.filter(order => order.id !== id);
    setOrders(updatedOrders);
    calculateMonthlyRevenue(updatedOrders);
  };

  // Category data for charts
  const categoryData = products.reduce((acc, product) => {
    const existing = acc.find(item => item.category === product.category);
    if (existing) {
      existing.count += 1;
      existing.value += product.sellingPrice * product.stock;
    } else {
      acc.push({
        category: product.category,
        count: 1,
        value: product.sellingPrice * product.stock
      });
    }
    return acc;
  }, [] as { category: string; count: number; value: number }[]);

  // Order status data
  const statusData = [
    { name: 'Pending', value: orders.filter(o => o.status === 'pending').length, color: '#f59e0b' },
    { name: 'Completed', value: orders.filter(o => o.status === 'completed').length, color: '#10b981' },
    { name: 'Cancelled', value: orders.filter(o => o.status === 'cancelled').length, color: '#ef4444' }
  ];

  // Reset form when closing
  const resetProductForm = () => {
    setNewProduct({
      name: '',
      category: '',
      purchasePrice: 0,
      sellingPrice: 0,
      stock: 0,
      description: ''
    });
    setErrors({});
    setShowProductForm(false);
  };

  const resetCustomerForm = () => {
    setNewCustomer({
      name: '',
      email: '',
      phone: '',
      address: ''
    });
    setErrors({});
    setShowCustomerForm(false);
  };

  const resetOrderForm = () => {
    setNewOrder({
      customerId: '',
      customerName: '',
      productId: '',
      productName: '',
      quantity: 1,
      orderDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    });
    setErrors({});
    setShowOrderForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-mint-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-purple-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">F</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Fel Store
                </h1>
                <p className="text-sm text-gray-600">Sistem ERP Toko Elektronik</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-purple-100 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'products', label: 'Produk', icon: '📦' },
              { id: 'customers', label: 'Pelanggan', icon: '👥' },
              { id: 'orders', label: 'Pesanan', icon: '📋' },
              { id: 'revenue', label: 'Pendapatan', icon: '💰' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 text-sm font-medium rounded-t-lg transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-purple-100 text-purple-700 border-b-2 border-purple-500'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-blue-400">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Produk</p>
                    <p className="text-3xl font-bold text-gray-800">{products.length}</p>
                    <p className="text-sm text-gray-500">{totalStock} unit stok</p>
                  </div>
                  <div className="bg-blue-100 rounded-full p-3">
                    <span className="text-2xl">📦</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-green-400">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Pelanggan</p>
                    <p className="text-3xl font-bold text-gray-800">{customers.length}</p>
                    <p className="text-sm text-gray-500">terdaftar</p>
                  </div>
                  <div className="bg-green-100 rounded-full p-3">
                    <span className="text-2xl">👥</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-purple-400">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Pesanan</p>
                    <p className="text-3xl font-bold text-gray-800">{orders.length}</p>
                    <p className="text-sm text-gray-500">{completedOrders} selesai</p>
                  </div>
                  <div className="bg-purple-100 rounded-full p-3">
                    <span className="text-2xl">📋</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-emerald-400">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Pendapatan</p>
                    <p className="text-3xl font-bold text-gray-800">{formatCurrency(totalRevenue)}</p>
                    <p className="text-sm text-gray-500">dari order selesai</p>
                  </div>
                  <div className="bg-emerald-100 rounded-full p-3">
                    <span className="text-2xl">💰</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Product Categories */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Produk per Kategori</h2>
                <div className="h-64">
                  {categoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ category, count, percent }) => `${category}: ${count} (${(percent * 100).toFixed(0)}%)`}
                          outerRadius={70}
                          innerRadius={40}
                          fill="#8884d8"
                          dataKey="count"
                          paddingAngle={2}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={['#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b'][index % 5]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend 
                          verticalAlign="bottom" 
                          height={36}
                          iconType="circle"
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full bg-gray-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-4xl mb-2 block">📊</span>
                        <p className="text-gray-500 text-sm">Data kategori akan muncul di sini</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Status */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Status Pesanan</h2>
                <div className="h-64">
                  {orders.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                          outerRadius={70}
                          innerRadius={40}
                          fill="#8884d8"
                          dataKey="value"
                          paddingAngle={2}
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend 
                          verticalAlign="bottom" 
                          height={36}
                          iconType="circle"
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full bg-gray-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-4xl mb-2 block">📋</span>
                        <p className="text-gray-500 text-sm">Data pesanan akan muncul di sini</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl shadow-md">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">Pesanan Terbaru</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pelanggan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produk</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customerName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.productName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(order.totalPrice)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {order.status === 'completed' ? 'Selesai' :
                             order.status === 'pending' ? 'Menunggu' : 'Dibatalkan'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Manajemen Produk</h2>
              <button
                onClick={() => setShowProductForm(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                + Tambah Produk
              </button>
            </div>

            {/* Product Form */}
            {showProductForm && (
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Tambah Produk Baru</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk *</label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Masukkan nama produk"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                    <input
                      type="text"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.category ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Masukkan kategori"
                    />
                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Harga Beli</label>
                    <input
                      type="number"
                      value={newProduct.purchasePrice}
                      onChange={(e) => setNewProduct({...newProduct, purchasePrice: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Harga Jual *</label>
                    <input
                      type="number"
                      value={newProduct.sellingPrice}
                      onChange={(e) => setNewProduct({...newProduct, sellingPrice: Number(e.target.value)})}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.sellingPrice ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="0"
                      min="0"
                    />
                    {errors.sellingPrice && <p className="text-red-500 text-xs mt-1">{errors.sellingPrice}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stok *</label>
                    <input
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({...newProduct, stock: Number(e.target.value)})}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.stock ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="0"
                      min="0"
                    />
                    {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                    <input
                      type="text"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Deskripsi produk"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={resetProductForm}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={addProduct}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            )}

            {/* Stock Update Form */}
            {stockUpdate && (
              <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-blue-400">
                <h3 className="text-lg font-semibold mb-4">
                  {stockUpdate.operation === 'add' ? 'Tambah Stok' : 'Kurangi Stok'}
                </h3>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
                    <input
                      type="number"
                      value={stockUpdate.quantity}
                      onChange={(e) => setStockUpdate({
                        ...stockUpdate,
                        quantity: Math.max(1, Number(e.target.value))
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                      placeholder="1"
                    />
                  </div>
                  <div className="flex space-x-2 pt-6">
                    <button
                      onClick={() => setStockUpdate(null)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => updateStock(stockUpdate.productId, stockUpdate.quantity, stockUpdate.operation)}
                      className={`px-4 py-2 text-white rounded-lg transition-colors ${
                        stockUpdate.operation === 'add' 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-orange-600 hover:bg-orange-700'
                      }`}
                    >
                      {stockUpdate.operation === 'add' ? 'Tambah' : 'Kurangi'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Products Table */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga Jual</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(product.sellingPrice)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            product.stock === 0 ? 'bg-red-100 text-red-800' :
                            product.stock < 5 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => openStockUpdate(product.id, 'add')}
                            className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 transition-colors"
                          >
                            + Stok
                          </button>
                          <button
                            onClick={() => openStockUpdate(product.id, 'subtract')}
                            className="bg-orange-600 text-white px-2 py-1 rounded text-xs hover:bg-orange-700 transition-colors"
                          >
                            - Stok
                          </button>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Manajemen Pelanggan</h2>
              <button
                onClick={() => setShowCustomerForm(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                + Tambah Pelanggan
              </button>
            </div>

            {/* Customer Form */}
            {showCustomerForm && (
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Tambah Pelanggan Baru</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap *</label>
                    <input
                      type="text"
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Masukkan nama lengkap"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Masukkan email"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telepon *</label>
                    <input
                      type="tel"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Masukkan nomor telepon"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                    <input
                      type="text"
                      value={newCustomer.address}
                      onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Masukkan alamat"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={resetCustomerForm}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={addCustomer}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            )}

            {/* Customers Table */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telepon</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {customers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.phone}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => deleteCustomer(customer.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Manajemen Pesanan</h2>
              <button
                onClick={() => setShowOrderForm(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                + Tambah Pesanan
              </button>
            </div>

            {/* Order Form */}
            {showOrderForm && (
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Tambah Pesanan Baru</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pelanggan *</label>
                    <select
                      value={newOrder.customerId}
                      onChange={(e) => setNewOrder({...newOrder, customerId: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.customerId ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Pilih Pelanggan</option>
                      {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name}
                        </option>
                      ))}
                    </select>
                    {errors.customerId && <p className="text-red-500 text-xs mt-1">{errors.customerId}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Produk *</label>
                    <select
                      value={newOrder.productId}
                      onChange={(e) => setNewOrder({...newOrder, productId: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.productId ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Pilih Produk</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} (Stok: {product.stock})
                        </option>
                      ))}
                    </select>
                    {errors.productId && <p className="text-red-500 text-xs mt-1">{errors.productId}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah *</label>
                    <input
                      type="number"
                      value={newOrder.quantity}
                      onChange={(e) => setNewOrder({...newOrder, quantity: Number(e.target.value)})}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.quantity ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="1"
                      min="1"
                    />
                    {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                    <input
                      type="date"
                      value={newOrder.orderDate}
                      onChange={(e) => setNewOrder({...newOrder, orderDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={newOrder.status}
                      onChange={(e) => setNewOrder({...newOrder, status: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  {newOrder.productId && newOrder.quantity > 0 && (
                    <div className="md:col-span-2">
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <p className="text-sm text-purple-800">
                          <strong>Total Harga:</strong> {
                            formatCurrency(
                              (products.find(p => p.id === newOrder.productId)?.sellingPrice || 0) * newOrder.quantity
                            )
                          }
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={resetOrderForm}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={addOrder}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            )}

            {/* Orders Table */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pelanggan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produk</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customerName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.productName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(order.totalPrice)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.orderDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                            className={`px-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                              order.status === 'completed' ? 'bg-green-100 text-green-800 border-green-300' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                              'bg-red-100 text-red-800 border-red-300'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => deleteOrder(order.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Revenue Tab */}
        {activeTab === 'revenue' && (
          <div className="space-y-8">
            {/* Revenue Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-emerald-400">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Pendapatan</p>
                    <p className="text-3xl font-bold text-gray-800">{formatCurrency(totalRevenue)}</p>
                  </div>
                  <div className="bg-emerald-100 rounded-full p-3">
                    <span className="text-2xl">💰</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-blue-400">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Order Selesai</p>
                    <p className="text-3xl font-bold text-gray-800">{completedOrders}</p>
                  </div>
                  <div className="bg-blue-100 rounded-full p-3">
                    <span className="text-2xl">✅</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-purple-400">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Rata-rata Order</p>
                    <p className="text-3xl font-bold text-gray-800">{formatCurrency(averageOrderValue)}</p>
                  </div>
                  <div className="bg-purple-100 rounded-full p-3">
                    <span className="text-2xl">📈</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Revenue Table */}
            <div className="bg-white rounded-2xl shadow-md">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">Rincian Pendapatan per Bulan</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bulan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah Order</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Pendapatan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rata-rata per Order</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {monthlyRevenue.length > 0 ? (
                      monthlyRevenue.map((revenue, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{revenue.month}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{revenue.orders}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(revenue.revenue)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(revenue.revenue / revenue.orders)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                          Belum ada data pendapatan
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Grafik Pendapatan</h2>
              <div className="h-80">
                {monthlyRevenue.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="month" 
                        stroke="#6b7280"
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        stroke="#6b7280"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `Rp ${(value / 1000000).toFixed(0)}jt`}
                      />
                      <Tooltip 
                        formatter={(value, name) => [
                          name === 'revenue' ? `Rp ${Number(value).toLocaleString('id-ID')}` : value,
                          name === 'revenue' ? 'Pendapatan' : name === 'orders' ? 'Jumlah Order' : name
                        ]}
                        labelFormatter={(label) => `Bulan: ${label}`}
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.5rem',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Legend />
                      <Bar 
                        dataKey="revenue" 
                        name="Pendapatan"
                        fill="#8b5cf6"
                        radius={[4, 4, 0, 0]}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        name="Trend Pendapatan"
                        stroke="#ec4899"
                        strokeWidth={3}
                        dot={{ fill: '#ec4899', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-6xl mb-4 block">📊</span>
                      <p className="text-gray-600">Belum ada data pendapatan untuk ditampilkan</p>
                      <p className="text-gray-400 text-sm">Grafik akan muncul setelah ada order yang selesai</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Revenue Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Revenue Trend */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Trend Pendapatan Bulanan</h2>
                <div className="h-64">
                  {monthlyRevenue.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyRevenue}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="month" 
                          stroke="#6b7280"
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis 
                          stroke="#6b7280"
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => `Rp ${(value / 1000000).toFixed(0)}jt`}
                        />
                        <Tooltip 
                          formatter={(value) => [`Rp ${Number(value).toLocaleString('id-ID')}`, 'Pendapatan']}
                          labelFormatter={(label) => `Bulan: ${label}`}
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.5rem',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#8b5cf6" 
                          fill="url(#colorGradient)"
                          strokeWidth={2}
                        />
                        <defs>
                          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full bg-gray-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-4xl mb-2 block">📈</span>
                        <p className="text-gray-500 text-sm">Data trend akan muncul di sini</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Orders vs Revenue */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Order vs Pendapatan</h2>
                <div className="h-64">
                  {monthlyRevenue.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyRevenue}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="month" 
                          stroke="#6b7280"
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis 
                          yAxisId="left"
                          stroke="#6b7280"
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis 
                          yAxisId="right"
                          orientation="right"
                          stroke="#6b7280"
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => `Rp ${(value / 1000000).toFixed(0)}jt`}
                        />
                        <Tooltip 
                          formatter={(value, name) => [
                            name === 'orders' ? value : `Rp ${Number(value).toLocaleString('id-ID')}`,
                            name === 'orders' ? 'Jumlah Order' : 'Pendapatan'
                          ]}
                          labelFormatter={(label) => `Bulan: ${label}`}
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.5rem',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Legend />
                        <Bar 
                          yAxisId="left"
                          dataKey="orders" 
                          name="Jumlah Order"
                          fill="#06b6d4"
                          radius={[4, 4, 0, 0]}
                        />
                        <Line 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="revenue" 
                          name="Pendapatan"
                          stroke="#8b5cf6"
                          strokeWidth={3}
                          dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full bg-gray-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-4xl mb-2 block">📊</span>
                        <p className="text-gray-500 text-sm">Data perbandingan akan muncul di sini</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Revenue Insights */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Insight Pendapatan</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Bulan Terbaik</p>
                      <p className="text-lg font-bold text-gray-800">
                        {monthlyRevenue.length > 0 
                          ? monthlyRevenue.reduce((best, current) => 
                              current.revenue > best.revenue ? current : best
                            ).month
                          : '-'
                        }
                      </p>
                    </div>
                    <div className="bg-purple-100 rounded-full p-2">
                      <span className="text-xl">🏆</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Rata-rata Bulanan</p>
                      <p className="text-lg font-bold text-gray-800">
                        {monthlyRevenue.length > 0 
                          ? formatCurrency(totalRevenue / monthlyRevenue.length)
                          : formatCurrency(0)
                        }
                      </p>
                    </div>
                    <div className="bg-emerald-100 rounded-full p-2">
                      <span className="text-xl">📊</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Bulan Aktif</p>
                      <p className="text-lg font-bold text-gray-800">{monthlyRevenue.length} Bulan</p>
                    </div>
                    <div className="bg-amber-100 rounded-full p-2">
                      <span className="text-xl">📅</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}