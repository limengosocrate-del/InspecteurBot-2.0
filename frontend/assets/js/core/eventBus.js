/**
 * Bus d'événements central - découplage entre modules.
 * @module core/eventBus
 */
class EventBus {
  constructor() { this.events = {}; }

  on(event, callback) {
    (this.events[event] ||= []).push(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  }

  emit(event, data) {
    (this.events[event] || []).forEach(cb => {
      try { cb(data); } catch (e) { console.error(`[EventBus] ${event}`, e); }
    });
  }
}
export default new EventBus();
