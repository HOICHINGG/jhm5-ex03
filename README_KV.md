# Cloudflare KV To-Do List App

本專案提供一個使用 Cloudflare Worker KV 作為儲存後端的待辦清單（To-Do List）應用，適合學習雲端無伺服器儲存與前端整合。

## 目錄結構

- `public/todo2.html`：Cloudflare KV 版本的前端頁面
- `src/index.ts`：Cloudflare Worker 入口（API 實作建議放這裡）
- `types/todo.d.ts`：TypeScript 型別定義
- `wrangler.jsonc`：Cloudflare Worker 設定檔，已包含 KV 綁定

## 快速開始

### 1. 建立 Cloudflare KV 命名空間

1. 登入 Cloudflare Dashboard
2. 前往 Workers & KV > KV
3. 建立一個新的命名空間，例如 `todo-kv`
4. 複製該命名空間的 ID
5. 編輯 `wrangler.jsonc`，將 `kv_namespaces` 的 `id` 欄位填入你的命名空間 ID：

```jsonc
"kv_namespaces": [
  { "binding": "TODO_KV", "id": "<your_kv_namespace_id>" }
]
```

### 2. 部署 Worker

```bash
npm install
npx wrangler deploy
```

### 3. 前端使用

- 開啟 `public/todo2.html`，確保其 JS 會呼叫你的 Worker API 端點（例如 `/api/tasks`）。
- 若本地測試，建議用 `npx wrangler dev` 啟動本地 Worker，再用瀏覽器開啟 `todo2.html`。

### 4. API 端點（建議）

- `GET /api/tasks`：取得所有任務
- `POST /api/tasks`：新增任務（body: `{ text: string }`）
- `PUT /api/tasks/:id`：更新任務（body: `{ text?: string, completed?: boolean }`）
- `DELETE /api/tasks/:id`：刪除任務

## 參考
- [Cloudflare Workers KV 官方文件](https://developers.cloudflare.com/workers/runtime-apis/kv/)
- [Wrangler 設定說明](https://developers.cloudflare.com/workers/wrangler/configuration/)

---

如需範例 Worker 程式或前端 fetch 實作，請參考 `src/index.ts` 或洽詢專案維護者。
