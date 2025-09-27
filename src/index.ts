/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */


import { TodoTask } from '../types/todo';

export interface Env {
	TODO_KV: KVNamespace;
	ASSETS: Fetcher;
}

function json(data: unknown, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: { 'Content-Type': 'application/json' }
	});
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);
		const { pathname } = url;

		// 靜態資源交給 ASSETS
		if (!pathname.startsWith('/api/tasks')) {
			return env.ASSETS.fetch(request);
		}

		// GET /api/tasks
		if (request.method === 'GET' && pathname === '/api/tasks') {
			const list = await env.TODO_KV.list({ prefix: 'task_' });
			const tasks: TodoTask[] = [];
			for (const key of list.keys) {
				const value = await env.TODO_KV.get(key.name, 'json');
				if (value) tasks.push(value as TodoTask);
			}
			return json({ success: true, tasks });
		}

			// POST /api/tasks
			if (request.method === 'POST' && pathname === '/api/tasks') {
				const body: any = await request.json().catch(() => ({}));
				const text = typeof body.text === 'string' ? body.text : '';
				if (!text) return json({ success: false, message: 'Text required' }, 400);
				const id = `task_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
				const task: TodoTask = { id, text, completed: false, createdAt: new Date().toISOString() };
				await env.TODO_KV.put(id, JSON.stringify(task));
				return json({ success: true, task });
			}

		// /api/tasks/:id
		const match = pathname.match(/^\/api\/tasks\/(.+)$/);
		if (match) {
			const id = match[1];

					// PUT /api/tasks/:id
					if (request.method === 'PUT') {
					const update: any = await request.json().catch(() => ({}));
					const oldRaw = await env.TODO_KV.get(id, 'json');
					const old: any = (typeof oldRaw === 'object' && oldRaw !== null) ? oldRaw : null;
					if (!old) return json({ success: false, message: 'Not found' }, 404);
					const task: TodoTask = { ...old, ...update };
					await env.TODO_KV.put(id, JSON.stringify(task));
					return json({ success: true, task });
					}

			// DELETE /api/tasks/:id
			if (request.method === 'DELETE') {
				await env.TODO_KV.delete(id);
				return json({ success: true });
			}
		}

		return new Response('Not found', { status: 404 });
	}
};
