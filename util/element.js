const __extension_replaceChildrenDescriptior = Object.getOwnPropertyDescriptor(Element.prototype, "replaceChildren");



function __extension_replaceChildrenFunction(...args) {
  while (this.firstChild) {
    this.firstChild.remove();
  }

  this.append(args);
}



if (!__extension_replaceChildrenDescriptior) {
  Object.defineProperty(Element.prototype, "replaceChildren", { value: __extension_replaceChildrenFunction, configurable: true, enumerable: true, writable: true });
}
