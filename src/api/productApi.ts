import { apiRequest, unwrapData } from './http';
import { API_BASE_URL } from './config';
import { tokenStorage } from './storage';

export type ProductVendorRef = {
  _id: string;
  name?: string;
  businessName?: string;
  isApproved?: boolean;
};

export type ProductModel = {
  _id: string;
  vendorId: string | ProductVendorRef;
  name: string;
  description?: string;
  image?: string;
  images?: string[];
  price?: number;
  inventory?: number;
  /** Units sold; used to mark Hot Product. */
  salesCount?: number;
  category?: string;
  /** Vendor availability: active | inactive | out_of_stock | discontinued */
  availabilityStatus?: string;
  createdAt?: string;
};

type ProductResponse = {
  success: boolean;
  message?: string;
  data?: ProductModel | ProductModel[];
};

export type UserModel = {
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  phone: String,
  avatar: String,

  location: {
    lat: Number,
    lng: Number
  },
  city: String,
  area: String,
  country: String,

  // User Address
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },

  resetPasswordToken: String, // added for forgot-password
  resetPasswordExpire: Date,   // added for forgot-password

  emailVerificationCode: String, // 6-digit verification code
  emailVerificationExpire: Date, // code expiration time
  emailVerified: { type: Boolean, default: false }, // email verification status

  // User Preferences
  birthdate: Date,
  gender: String,
  interests: [String],
  preferencesCompleted: { type: Boolean, default: false },

  // RBAC Fields
  role: {
    type: String,
    enum: ['USER', 'VENDOR', 'ADMIN'],
    default: 'USER'
  },
  isApproved: { type: Boolean, default: false }, // For vendors

  // Temporary vendor data storage (before approval)
  vendorData: {
    businessName: String,
    businessAddress: String,
    businessPhone: String,
    category: String,
    description: String
  },

  walletCoins: {
    type: Number,
    default: 0
  },

  // Notifications (push + in-app)
  notificationsEnabled: { type: Boolean, default: true },
  /** FCM/APNs tokens for this user (multiple devices). */
  deviceTokens: { type: [String], default: [] },

  lastPasswordChangedAt: Date,
  lastProfileUpdatedAt: Date,

  createdAt: { type: Date }
};

export async function createProductApi(vendorId: string, input: {
  name: string;
  description?: string;
  price?: number;
  inventory?: number;
  category?: string;
  image?: string;
  availabilityStatus?: string;
}): Promise<ProductModel> {
  const res = await apiRequest<ProductResponse>(`/products/${vendorId}`, {
    method: 'POST',
    auth: true,
    body: input,
  });
  const data = unwrapData<ProductModel | ProductModel[]>(res);
  return Array.isArray(data) ? data[0] : data;
}

/** All catalog products from vendors (public list). */
export async function getAllProductsApi(): Promise<ProductModel[]> {
  const res = await apiRequest<ProductModel[] | ProductModel | ProductResponse>('/products', {
    auth: false,
  });
  if (Array.isArray(res)) return res;
  const data = unwrapData<ProductModel[] | ProductModel>(res as ProductResponse);
  return Array.isArray(data) ? data : [data];
}

export async function getVendorProductsApi(vendorId: string): Promise<ProductModel[]> {
  const res = await apiRequest<ProductResponse | ProductModel[]>(`/products/vendor/${vendorId}`, {
    auth: true,
  });
  const data = unwrapData<ProductModel[] | ProductModel>(res as any);
  return Array.isArray(data) ? data : [data];
}

export async function deleteProductApi(productId: string): Promise<void> {
  await apiRequest(`/products/${productId}`, { method: 'DELETE', auth: true });
}

export async function updateProductApi(productId: string, input: {
  name?: string;
  description?: string;
  price?: number;
  inventory?: number;
  category?: string;
  availabilityStatus?: string;
}): Promise<ProductModel> {
  const res = await apiRequest<ProductResponse | ProductModel>(`/products/${productId}`, {
    method: 'PUT',
    auth: true,
    body: input,
  });
  const data = unwrapData<ProductModel[] | ProductModel>(res as any);
  return Array.isArray(data) ? data[0] : data;
}

export async function getProductByIdApi(productId: string): Promise<ProductModel> {
  const res = await apiRequest<ProductResponse | ProductModel>(`/products/${productId}`, { auth: true });
  const data = unwrapData<ProductModel[] | ProductModel>(res as any);
  return Array.isArray(data) ? data[0] : data;
}

export async function uploadProductImageApi(productId: string, fileUri: string): Promise<ProductModel> {
  const token = tokenStorage.getToken();
  if (!token) throw new Error('Not authenticated');

  const form = new FormData();
  form.append('image', {
    uri: fileUri,
    type: 'image/jpeg',
    name: 'product.jpg',
  } as any);

  const res = await fetch(`${API_BASE_URL}/products/${productId}/image`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const payload = isJson ? await res.json() : null;
  if (!res.ok) {
    const msg = payload?.message || payload?.error || `Upload failed with ${res.status}`;
    throw new Error(msg);
  }
  const data = payload?.data;
  if (!data || typeof data !== 'object') throw new Error('Upload failed');
  return data as ProductModel;
}

export async function deleteProductImageApi(productId: string): Promise<ProductModel> {
  const res = await apiRequest<ProductResponse | ProductModel>(`/products/${productId}/image`, {
    method: 'DELETE',
    auth: true,
  });
  const data = unwrapData<ProductModel[] | ProductModel>(res as any);
  return Array.isArray(data) ? data[0] : data;
}

export async function addProductImageApi(productId: string, fileUri: string): Promise<ProductModel> {
  const token = tokenStorage.getToken();
  if (!token) throw new Error('Not authenticated');

  const form = new FormData();
  form.append('image', {
    uri: fileUri,
    type: 'image/jpeg',
    name: 'product.jpg',
  } as any);

  const res = await fetch(`${API_BASE_URL}/products/${productId}/images`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const payload = isJson ? await res.json() : null;
  if (!res.ok) {
    const msg = payload?.message || payload?.error || `Upload failed with ${res.status}`;
    throw new Error(msg);
  }
  const data = payload?.data;
  if (!data || typeof data !== 'object') throw new Error('Upload failed');
  return data as ProductModel;
}

export async function replaceProductImageAtApi(productId: string, index: number, fileUri: string): Promise<ProductModel> {
  const token = tokenStorage.getToken();
  if (!token) throw new Error('Not authenticated');

  const form = new FormData();
  form.append('image', {
    uri: fileUri,
    type: 'image/jpeg',
    name: 'product.jpg',
  } as any);

  const res = await fetch(`${API_BASE_URL}/products/${productId}/images/${index}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const payload = isJson ? await res.json() : null;
  if (!res.ok) {
    const msg = payload?.message || payload?.error || `Upload failed with ${res.status}`;
    throw new Error(msg);
  }
  const data = payload?.data;
  if (!data || typeof data !== 'object') throw new Error('Upload failed');
  return data as ProductModel;
}

export async function deleteProductImageAtApi(productId: string, index: number): Promise<ProductModel> {
  const res = await apiRequest<ProductResponse | ProductModel>(`/products/${productId}/images/${index}`, {
    method: 'DELETE',
    auth: true,
  });
  const data = unwrapData<ProductModel[] | ProductModel>(res as any);
  return Array.isArray(data) ? data[0] : data;
}

