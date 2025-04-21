const __extension_addEventListenerDescriptior = Object.getOwnPropertyDescriptor(EventTarget.prototype, "addEventListener");
const __extension_removeEventListenerDescriptior = Object.getOwnPropertyDescriptor(EventTarget.prototype, "removeEventListener");



function __extension_addEventListenerFunction(type, func, options) {
  __extension_addEventListenerDescriptior.value.call(this, type, func, options);
  this.eventListeners ??= new Map<string, Function[]>();

  if (!this.eventListeners.has(type)) {
    this.eventListeners.set(type, []);
  }

  this.eventListeners.get(type).push(func);
}



function __extension_removeEventListenerFunction(type, func, options) {
  __extension_removeEventListenerDescriptior.value.call(this, type, func, options);

  const listeners = this.eventListeners?.get(type) ?? [];
  const index = listeners.indexOf(func);
  listeners.splice(index, 1);

  if (listeners.length === 0) {
    this.eventListeners?.delete(type);
  }
}



Object.defineProperty(EventTarget.prototype, "eventListeners", { value: null, configurable: true, enumerable: true, writable: true });
Object.defineProperty(EventTarget.prototype, "addEventListener", { ...__extension_addEventListenerDescriptior, value: __extension_addEventListenerFunction });
Object.defineProperty(EventTarget.prototype, "removeEventListener", { ...__extension_removeEventListenerDescriptior, value: __extension_removeEventListenerFunction });



interface EventTarget {
  eventListeners: Map<string, Function[]>;
}
