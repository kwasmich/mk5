missing files:
* /apple-touch-icon-120x120-precomposed.png
* /apple-touch-icon-120x120.png
* /apple-touch-icon-precomposed.png
* /apple-touch-icon.png
* /favicon.ico


DOM
---
* ResizeObserver


JavaScript
----------
`a?.b   a?.[0]   a?.()` // optional chaining
`a ?? "default"` // nullish coalescing operator
`a &&= b` // and assignment operator
`a ||= b` // or assignment operator
`a ??= b` // nullish assignment operator

Safari 14.1.2 supports
- property definition
- static property definition
- private properties

but not private class methods :(

```
class Clazz {
    prop = 123;             // property definition
    static sprop = "abc";   // static property definition
    #priv = true            // private property definition
}
```

Decorators are currently NOT supported :(
```
@abc
@deco("somethin")
class x {}
```

```
new CustomEvent("eventName", {
    detail: {}, // payload
    bubbles: true, // let the parent custom element receive the event
    composed: true // continue to all parents until root
})
```

```
<HTMLElement>.clone(true) // use when the element is being inserted into the same DOM
<document>.importNode(<HTMLElement>, true) // use when document and HTMLElement are part of different DOMs
```


HTTP
----
[Cache-Control](https://tools.ietf.org/html/rfc7234)


Safari
------
https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/AdjustingtheTextSize/AdjustingtheTextSize.html#//apple_ref/doc/uid/TP40006510-SW1


[WebRTC](https://github.com/JGH153/web-components-webrtc)



Worker as Threads

List
    Sections
    Hierarchy

NavigationView

PopOver

HStack
VStack
ZStack
LazyHStack
LazyVStack
LazyList
ScrollView ?
LazyVGrid
LazyHGrid


Localization

Serialize/Deserialize
Routing
StateRestoration


State <- source of truth
    ^- Binding

ObservableObject
    @Published
    objectWillChange
@ObservedObject
@StateObject
@EnvironmentObject
