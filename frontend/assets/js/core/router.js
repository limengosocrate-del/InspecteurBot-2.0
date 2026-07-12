/**
 * Routeur SPA par hash - navigation entre menus du module.
 * @module core/router
 */
import eventBus from './eventBus.js';

class Router {
  constructor() {
    this.routes = {};
    this.current = null;
    window.addEventListener('hashchange', () => this._resolve());
  }

  register(path, handler) { this.routes[path] = handler; return this; }

  start() { this._resolve(); }

  navigate(path) { window.location.hash = path; }

  _resolve() {
    const hash = window.location.hash.slice(1) || 'accueil';
    const [path, ...params] = hash.split('/');
    const handler = this.routes[path] || this.routes['accueil'];
    this.current = path;
    eventBus.emit('route:change', { path, params });
    if (handler) handler(params);
  }
}
export default new Router();
