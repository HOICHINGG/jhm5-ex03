// types/todo.d.ts

/**
 * 任務物件的型別
 */
export interface TodoTask {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

/**
 * Cloudflare Worker KV REST API 任務回應格式
 */
export interface TodoApiResponse {
  success: boolean;
  message?: string;
  task?: TodoTask;
  tasks?: TodoTask[];
}

/**
 * Cloudflare Worker KV REST API 請求格式
 */
export interface TodoApiRequest {
  text?: string;
  completed?: boolean;
}
