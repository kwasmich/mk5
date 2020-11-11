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

```
class Clazz {
    prop = 123;             // property definition not supported by Safari
    static sprop = "abc";   // static property definition not supported by Safari
}
```
use
```
Clazz.sprop = "abc";
```
instead

Decorators are currently NOT supported :(
```
@abc
@deco("somethin")
class x {}
```


HTTP
----
[Cache-Control](https://tools.ietf.org/html/rfc7234)


Safari
------
https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/AdjustingtheTextSize/AdjustingtheTextSize.html#//apple_ref/doc/uid/TP40006510-SW1



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
