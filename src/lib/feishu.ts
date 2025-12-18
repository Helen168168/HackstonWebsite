import axios, { AxiosInstance } from 'axios';

/**
 * 飞书多维表格 API 客户端封装
 */
class FeishuClient {
  private appId: string;
  private appSecret: string;
  private appToken: string;
  private accessToken: string = '';
  private tokenExpireTime: number = 0;
  private axiosInstance: AxiosInstance;

  // 表格 ID 配置
  public readonly tables = {
    users: 'tblwN424oKlIHsl6',
    challenges: 'tbl80xLBbepANlib',
    teams: 'tblkBfUfxclu92in',
    team_members: 'tblsUMlH9O3kNbPm',
    projects: 'tbl52Xc8owYTXLMC',
    mentors: 'tblwoLznMSV7t7O4',
  };

  constructor(appId: string, appSecret: string, appToken: string) {
    this.appId = appId;
    this.appSecret = appSecret;
    this.appToken = appToken;

    // 创建 axios 实例
    this.axiosInstance = axios.create({
      baseURL: 'https://open.feishu.cn/open-apis',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 请求拦截器：自动添加 access_token
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        await this.ensureAccessToken();
        config.headers.Authorization = `Bearer ${this.accessToken}`;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器：处理错误
    this.axiosInstance.interceptors.response.use(
      (response) => {
        if (response.data.code !== 0) {
          console.error('飞书API错误:', response.data);
          throw new Error(response.data.msg || '飞书API请求失败');
        }
        return response;
      },
      (error) => {
        console.error('请求错误:', error);
        return Promise.reject(error);
      }
    );
  }

  /**
   * 获取 tenant_access_token
   */
  private async getTenantAccessToken(): Promise<string> {
    try {
      const response = await axios.post(
        'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
        {
          app_id: this.appId,
          app_secret: this.appSecret,
        }
      );

      if (response.data.code !== 0) {
        throw new Error(response.data.msg || '获取access_token失败');
      }

      return response.data.tenant_access_token;
    } catch (error) {
      console.error('获取tenant_access_token失败:', error);
      throw error;
    }
  }

  /**
   * 确保 access_token 有效
   */
  private async ensureAccessToken(): Promise<void> {
    const now = Date.now();
    // 提前5分钟刷新token
    if (!this.accessToken || now >= this.tokenExpireTime - 5 * 60 * 1000) {
      this.accessToken = await this.getTenantAccessToken();
      // token有效期为2小时
      this.tokenExpireTime = now + 2 * 60 * 60 * 1000;
    }
  }

  /**
   * 查询记录列表
   * @param tableId 表格ID
   * @param params 查询参数
   */
  async listRecords(
    tableId: string,
    params?: {
      view_id?: string;
      filter?: string;
      sort?: string;
      page_size?: number;
      page_token?: string;
    }
  ) {
    const response = await this.axiosInstance.get(
      `/bitable/v1/apps/${this.appToken}/tables/${tableId}/records`,
      { params }
    );
    return response.data.data;
  }

  /**
   * 获取单条记录
   * @param tableId 表格ID
   * @param recordId 记录ID
   */
  async getRecord(tableId: string, recordId: string) {
    const response = await this.axiosInstance.get(
      `/bitable/v1/apps/${this.appToken}/tables/${tableId}/records/${recordId}`
    );
    return response.data.data;
  }

  /**
   * 创建记录
   * @param tableId 表格ID
   * @param fields 字段数据
   */
  async createRecord(tableId: string, fields: Record<string, any>) {
    const response = await this.axiosInstance.post(
      `/bitable/v1/apps/${this.appToken}/tables/${tableId}/records`,
      { fields }
    );
    return response.data.data;
  }

  /**
   * 批量创建记录
   * @param tableId 表格ID
   * @param records 记录数组
   */
  async batchCreateRecords(
    tableId: string,
    records: Array<{ fields: Record<string, any> }>
  ) {
    const response = await this.axiosInstance.post(
      `/bitable/v1/apps/${this.appToken}/tables/${tableId}/records/batch_create`,
      { records }
    );
    return response.data.data;
  }

  /**
   * 更新记录
   * @param tableId 表格ID
   * @param recordId 记录ID
   * @param fields 要更新的字段
   */
  async updateRecord(
    tableId: string,
    recordId: string,
    fields: Record<string, any>
  ) {
    const response = await this.axiosInstance.put(
      `/bitable/v1/apps/${this.appToken}/tables/${tableId}/records/${recordId}`,
      { fields }
    );
    return response.data.data;
  }

  /**
   * 批量更新记录
   * @param tableId 表格ID
   * @param records 记录数组
   */
  async batchUpdateRecords(
    tableId: string,
    records: Array<{ record_id: string; fields: Record<string, any> }>
  ) {
    const response = await this.axiosInstance.post(
      `/bitable/v1/apps/${this.appToken}/tables/${tableId}/records/batch_update`,
      { records }
    );
    return response.data.data;
  }

  /**
   * 删除记录
   * @param tableId 表格ID
   * @param recordId 记录ID
   */
  async deleteRecord(tableId: string, recordId: string) {
    const response = await this.axiosInstance.delete(
      `/bitable/v1/apps/${this.appToken}/tables/${tableId}/records/${recordId}`
    );
    return response.data.data;
  }

  /**
   * 批量删除记录
   * @param tableId 表格ID
   * @param recordIds 记录ID数组
   */
  async batchDeleteRecords(tableId: string, recordIds: string[]) {
    const response = await this.axiosInstance.post(
      `/bitable/v1/apps/${this.appToken}/tables/${tableId}/records/batch_delete`,
      { records: recordIds }
    );
    return response.data.data;
  }

  /**
   * 搜索记录（使用过滤条件）
   * @param tableId 表格ID
   * @param filter 过滤条件
   */
  async searchRecords(tableId: string, filter: string) {
    const response = await this.axiosInstance.post(
      `/bitable/v1/apps/${this.appToken}/tables/${tableId}/records/search`,
      {
        filter,
        automatic_fields: true,
      }
    );
    return response.data.data;
  }
}

// 创建飞书客户端实例
const appId = import.meta.env.VITE_FEISHU_APP_ID;
const appSecret = import.meta.env.VITE_FEISHU_APP_SECRET;
const appToken = import.meta.env.VITE_FEISHU_APP_TOKEN;

if (!appId || !appSecret || !appToken) {
  throw new Error('缺少飞书配置信息，请检查环境变量');
}

export const feishuClient = new FeishuClient(appId, appSecret, appToken);
export default feishuClient;

