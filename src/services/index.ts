import { Product, Order } from '../types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, PRODUCT_CATEGORIES } from '../data/mockData';

export interface ApiRequestLog {
  id: string;
  timestamp: string;
  method: string;
  url: string;
  endpoint: string;
  status: number;
  responseStatus: number;
  durationMs: number;
  isMock: boolean;
  requestBody?: any;
  responseBody?: any;
}

// In-Memory Telemetry Logger
let logs: ApiRequestLog[] = [
  {
    id: 'log-001',
    timestamp: new Date().toISOString(),
    method: 'GET',
    url: '/api/v1/products',
    endpoint: '/api/v1/products',
    status: 200,
    responseStatus: 200,
    durationMs: 42,
    isMock: true,
    responseBody: { count: INITIAL_PRODUCTS.length },
  },
  {
    id: 'log-002',
    timestamp: new Date().toISOString(),
    method: 'GET',
    url: '/api/v1/orders',
    endpoint: '/api/v1/orders',
    status: 200,
    responseStatus: 200,
    durationMs: 38,
    isMock: true,
    responseBody: { count: 1 },
  }
];
const logListeners = new Set<(logs: ApiRequestLog[]) => void>();

export const HttpClient = {
  mockLatencyMs: 150,

  setMockLatency(ms: number) {
    this.mockLatencyMs = ms;
  },

  getLogs(): ApiRequestLog[] {
    return [...logs];
  },

  clearLogs() {
    logs = [];
    logListeners.forEach((fn) => fn([]));
  },

  subscribeToLogs(fn: (logs: ApiRequestLog[]) => void): () => void {
    logListeners.add(fn);
    fn([...logs]);
    return () => logListeners.delete(fn);
  },

  logRequest(entry: Partial<ApiRequestLog>) {
    const url = entry.url || entry.endpoint || '/api';
    const status = entry.responseStatus || entry.status || 200;
    const newLog: ApiRequestLog = {
      id: `REQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      method: entry.method || 'GET',
      url,
      endpoint: entry.endpoint || url,
      status,
      responseStatus: status,
      durationMs: entry.durationMs || 50,
      isMock: entry.isMock ?? true,
      requestBody: entry.requestBody,
      responseBody: entry.responseBody,
    };
    logs = [newLog, ...logs.slice(0, 49)];
    logListeners.forEach((fn) => fn([...logs]));
    return newLog;
  },
};

// Reactive mock store
class MockDataStore {
  private products: Product[] = [...INITIAL_PRODUCTS];
  private orders: Order[] = [...INITIAL_ORDERS];
  private prodListeners = new Set<(prods: Product[]) => void>();
  private orderListeners = new Set<(orders: Order[]) => void>();

  getProducts(): Product[] {
    return this.products;
  }

  getOrders(): Order[] {
    return this.orders;
  }

  setProducts(prods: Product[]) {
    this.products = prods;
    this.prodListeners.forEach((fn) => fn(this.products));
  }

  setOrders(orders: Order[]) {
    this.orders = orders;
    this.orderListeners.forEach((fn) => fn(this.orders));
  }

  subscribeProducts(fn: (prods: Product[]) => void): () => void {
    this.prodListeners.add(fn);
    fn(this.products);
    return () => this.prodListeners.delete(fn);
  }

  subscribeOrders(fn: (orders: Order[]) => void): () => void {
    this.orderListeners.add(fn);
    fn(this.orders);
    return () => this.orderListeners.delete(fn);
  }
}

export const mockDataStore = new MockDataStore();

export const serviceRegistry = {
  useMock: true,
  isUsingMock() {
    return this.useMock;
  },
  setUsingMock(val: boolean) {
    this.useMock = val;
  },
  getHttpClient() {
    return HttpClient;
  },
};

export const productsService = {
  async getProducts(params?: any) {
    const start = Date.now();
    await new Promise((r) => setTimeout(r, HttpClient.mockLatencyMs));
    let prods = mockDataStore.getProducts();
    if (params?.limit) {
      prods = prods.slice(0, Number(params.limit));
    }
    const result = { success: true, count: prods.length, data: prods, statusCode: 200 };
    HttpClient.logRequest({
      method: 'GET',
      endpoint: '/api/v1/products',
      url: '/api/v1/products',
      responseStatus: 200,
      durationMs: Date.now() - start,
      responseBody: result,
    });
    return result;
  },
  async getProductById(id: string) {
    const start = Date.now();
    await new Promise((r) => setTimeout(r, HttpClient.mockLatencyMs));
    const p = mockDataStore.getProducts().find((item) => item.id === id);
    const result = p ? { success: true, data: p, statusCode: 200 } : { success: false, error: 'Product not found', statusCode: 404 };
    HttpClient.logRequest({
      method: 'GET',
      endpoint: `/api/v1/products/${id}`,
      url: `/api/v1/products/${id}`,
      responseStatus: result.statusCode,
      durationMs: Date.now() - start,
      responseBody: result,
    });
    return result;
  },
  async createProduct(payload: any) {
    const start = Date.now();
    await new Promise((r) => setTimeout(r, HttpClient.mockLatencyMs));
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: payload.name || 'New Wholesale Product',
      category: payload.category || 'General',
      sku: payload.sku || `SKU-${Date.now().toString().slice(-4)}`,
      supplierCostPKR: Number(payload.supplierCostPKR) || 1000,
      recSellingPricePKR: Number(payload.recSellingPricePKR) || 1999,
      stock: Number(payload.stock) || 50,
      rating: 5.0,
      isActive: true,
      image: payload.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    };
    const current = mockDataStore.getProducts();
    mockDataStore.setProducts([newProd, ...current]);
    const result = { success: true, data: newProd, statusCode: 201 };
    HttpClient.logRequest({
      method: 'POST',
      endpoint: '/api/v1/products',
      url: '/api/v1/products',
      responseStatus: 201,
      durationMs: Date.now() - start,
      requestBody: payload,
      responseBody: result,
    });
    return result;
  },
  async adjustStock(id: string, options: any) {
    const start = Date.now();
    await new Promise((r) => setTimeout(r, HttpClient.mockLatencyMs));
    const prods = mockDataStore.getProducts().map((p) => {
      if (p.id === id) {
        const change = Number(options.stockChange) || 10;
        const newStock = options.operation === 'DECREASE' ? Math.max(0, p.stock - change) : p.stock + change;
        return { ...p, stock: newStock };
      }
      return p;
    });
    mockDataStore.setProducts(prods);
    const updated = prods.find((p) => p.id === id);
    const result = { success: true, data: updated, statusCode: 200 };
    HttpClient.logRequest({
      method: 'PATCH',
      endpoint: `/api/v1/products/${id}/stock`,
      url: `/api/v1/products/${id}/stock`,
      responseStatus: 200,
      durationMs: Date.now() - start,
      requestBody: options,
      responseBody: result,
    });
    return result;
  },
  async getCategories() {
    const start = Date.now();
    await new Promise((r) => setTimeout(r, HttpClient.mockLatencyMs));
    const result = { success: true, data: PRODUCT_CATEGORIES, statusCode: 200 };
    HttpClient.logRequest({
      method: 'GET',
      endpoint: '/api/v1/categories',
      url: '/api/v1/categories',
      responseStatus: 200,
      durationMs: Date.now() - start,
      responseBody: result,
    });
    return result;
  },
  async getTrendingProducts(limit = 5) {
    const start = Date.now();
    await new Promise((r) => setTimeout(r, HttpClient.mockLatencyMs));
    const trending = mockDataStore.getProducts().slice(0, Number(limit));
    const result = { success: true, data: trending, statusCode: 200 };
    HttpClient.logRequest({
      method: 'GET',
      endpoint: '/api/v1/products/trending',
      url: '/api/v1/products/trending',
      responseStatus: 200,
      durationMs: Date.now() - start,
      responseBody: result,
    });
    return result;
  },
};

export const ordersService = {
  async getOrders(params?: any) {
    const start = Date.now();
    await new Promise((r) => setTimeout(r, HttpClient.mockLatencyMs));
    const orders = mockDataStore.getOrders();
    const result = { success: true, count: orders.length, data: orders, statusCode: 200 };
    HttpClient.logRequest({
      method: 'GET',
      endpoint: '/api/v1/orders',
      url: '/api/v1/orders',
      responseStatus: 200,
      durationMs: Date.now() - start,
      responseBody: result,
    });
    return result;
  },
  async getOrderById(id: string) {
    const start = Date.now();
    await new Promise((r) => setTimeout(r, HttpClient.mockLatencyMs));
    const ord = mockDataStore.getOrders().find((o) => o.id === id || o.orderNumber === id);
    const result = ord ? { success: true, data: ord, statusCode: 200 } : { success: false, error: 'Order not found', statusCode: 404 };
    HttpClient.logRequest({
      method: 'GET',
      endpoint: `/api/v1/orders/${id}`,
      url: `/api/v1/orders/${id}`,
      responseStatus: result.statusCode,
      durationMs: Date.now() - start,
      responseBody: result,
    });
    return result;
  },
  async createOrder(payload: any) {
    const start = Date.now();
    await new Promise((r) => setTimeout(r, HttpClient.mockLatencyMs));
    const newOrd: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `YM-${Math.floor(10000 + Math.random() * 90000)}`,
      customerName: payload.customerName || 'Test Customer',
      customerPhone: payload.customerPhone || '0300-1234567',
      customerCity: payload.customerCity || 'Lahore',
      customerAddress: payload.customerAddress || 'Direct Address',
      sellingPricePKR: Number(payload.sellingPricePKR) || 2500,
      status: 'COD_CONFIRMED',
      createdAt: new Date().toISOString(),
    };
    mockDataStore.setOrders([newOrd, ...mockDataStore.getOrders()]);
    const result = { success: true, data: newOrd, statusCode: 201 };
    HttpClient.logRequest({
      method: 'POST',
      endpoint: '/api/v1/orders',
      url: '/api/v1/orders',
      responseStatus: 201,
      durationMs: Date.now() - start,
      requestBody: payload,
      responseBody: result,
    });
    return result;
  },
  async verifyCodOrder(orderId: string, options: any) {
    const start = Date.now();
    await new Promise((r) => setTimeout(r, HttpClient.mockLatencyMs));
    const updated = mockDataStore.getOrders().map((o) => {
      if (o.id === orderId || o.orderNumber === orderId) {
        return { ...o, codOtpVerified: true, status: 'COD_CONFIRMED' as const };
      }
      return o;
    });
    mockDataStore.setOrders(updated);
    const result = { success: true, orderId, verified: true, statusCode: 200 };
    HttpClient.logRequest({
      method: 'POST',
      endpoint: `/api/v1/orders/${orderId}/verify-cod`,
      url: `/api/v1/orders/${orderId}/verify-cod`,
      responseStatus: 200,
      durationMs: Date.now() - start,
      requestBody: options,
      responseBody: result,
    });
    return result;
  },
  async dispatchOrder(orderId: string, options: any) {
    const start = Date.now();
    await new Promise((r) => setTimeout(r, HttpClient.mockLatencyMs));
    const trackingNumber = `TRX-${Math.floor(1000000 + Math.random() * 9000000)}`;
    const updated = mockDataStore.getOrders().map((o) => {
      if (o.id === orderId || o.orderNumber === orderId) {
        return {
          ...o,
          status: 'DISPATCHED' as const,
          courierName: options.courierName || 'Trax Logistics',
          trackingNumber,
        };
      }
      return o;
    });
    mockDataStore.setOrders(updated);
    const result = { success: true, orderId, trackingNumber, statusCode: 200 };
    HttpClient.logRequest({
      method: 'POST',
      endpoint: `/api/v1/orders/${orderId}/dispatch`,
      url: `/api/v1/orders/${orderId}/dispatch`,
      responseStatus: 200,
      durationMs: Date.now() - start,
      requestBody: options,
      responseBody: result,
    });
    return result;
  },
  async getOrderMetrics() {
    const start = Date.now();
    await new Promise((r) => setTimeout(r, HttpClient.mockLatencyMs));
    const orders = mockDataStore.getOrders();
    const metrics = {
      totalOrders: orders.length,
      delivered: orders.filter((o) => o.status === 'DELIVERED').length,
      dispatched: orders.filter((o) => o.status === 'DISPATCHED').length,
      pending: orders.filter((o) => o.status === 'PENDING_VERIFICATION' || o.status === 'COD_CONFIRMED').length,
    };
    const result = { success: true, data: metrics, statusCode: 200 };
    HttpClient.logRequest({
      method: 'GET',
      endpoint: '/api/v1/orders/metrics',
      url: '/api/v1/orders/metrics',
      responseStatus: 200,
      durationMs: Date.now() - start,
      responseBody: result,
    });
    return result;
  },
};

export const apiService = {
  products: productsService,
  orders: ordersService,
  client: HttpClient,
};

export const productsApi = productsService;
export const ordersApi = ordersService;
