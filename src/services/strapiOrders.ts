import axios, { AxiosInstance } from 'axios';
import {
  StrapiOrderCreateInput,
  StrapiOrderEntity,
  StrapiOrderListMeta,
  StrapiOrderAttributes,
} from '../types';

interface StrapiListResponse<T> {
  data: T[];
  meta: StrapiOrderListMeta;
}

interface StrapiSingleResponse<T> {
  data: T;
}

class StrapiOrdersService {
  private client: AxiosInstance;
  private readonly baseURL: string;
  private readonly apiToken?: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';
    this.apiToken =
      import.meta.env.VITE_STRAPI_TOKEN ||
      'ac1cff6ff0ad69e990597e630f57738dd6f56c708552ea9328b6fec9700057893a87617e82b1c5207d2e5e67bdef5bdd76abecd3753fcc0ad17a29d35b7f6c7b39b6a330e58e28244b9ae9c8068fc1ea42e19017a9e3c823fa3ced3e3b8fc20718ad5f5637ba8c368d9cf7c477ed71f06a888a94e22558d3ce0918b90bb1933a';

    this.client = axios.create({
      baseURL: `${this.baseURL}/api`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use((config) => {
      const authToken = localStorage.getItem('auth_token');

      if (authToken) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${authToken}`,
        };
      } else if (this.apiToken) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${this.apiToken}`,
        };
      }

      return config;
    });
  }

  private handleError(error: any): never {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.error?.message || error.message || 'Strapi order request failed';
      console.error('Strapi Orders API Error:', {
        status,
        message,
        details: error.response.data?.error?.details,
      });
      throw new Error(message);
    }

    console.error('Strapi Orders Network Error:', error);
    throw new Error('Unable to reach Strapi orders API');
  }

  async createOrder(order: StrapiOrderCreateInput): Promise<StrapiOrderEntity> {
    try {
      const response = await this.client.post<StrapiSingleResponse<StrapiOrderEntity>>('/orders', {
        data: order,
      });

      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getOrder(id: number, populate: string = '*'): Promise<StrapiOrderEntity> {
    try {
      const response = await this.client.get<StrapiSingleResponse<StrapiOrderEntity>>(`/orders/${id}`, {
        params: { populate },
      });

      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async listOrders(params: Record<string, unknown> = {}): Promise<StrapiListResponse<StrapiOrderEntity>> {
    try {
      const response = await this.client.get<StrapiListResponse<StrapiOrderEntity>>('/orders', {
        params,
      });

      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateOrder(id: number, data: Partial<StrapiOrderAttributes>): Promise<StrapiOrderEntity> {
    try {
      const response = await this.client.put<StrapiSingleResponse<StrapiOrderEntity>>(`/orders/${id}`, {
        data,
      });

      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }
}

export const strapiOrders = new StrapiOrdersService();
export default strapiOrders;
