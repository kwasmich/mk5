```js
navigate() {
    const ce = new CustomEvent("ChangePage", { detail: Pages.Home });
    this.dispatchEvent(ce);
}
```

