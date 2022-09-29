# Use PointerEvents instead of MouseEvents and TouchEvents.
[PointerEvents](https://www.w3.org/TR/pointerevents/)
[TouchEvents](https://www.w3.org/TR/touch-events/)
[MouseEvents](https://www.w3.org/TR/uievents/#events-mouseevents)

# Latest ECMA Script features
[Finished Proposals](https://github.com/tc39/proposals/blob/main/finished-proposals.md)


# ES2016
exponentials: 
    2**3 ^= Math.pow(2, 3);

Array.includes:
    [2, 3, 5, 7].includes(3);


# ES2017
Object.values:
    const dat = { a: 1, b: 2 };
    Object.values(dat); // => [1, 2];

Object.entries:
    Object.entries(dat); // => [["a", 1], ["b", 2]];

String.padStart:
    "affe".padStart(7, "_"); // => "___affe";

String.padEnd:
    "affe".padEnd(7, "."); // => "affe...";

Trailing Commas:
    ["Abc", 123,]; // => OK ["Abc", 123];

Async / Await:
    …


# ES2018
Spread:
    const dat = { a: 1, b: 2 };
    const data = { ...dat, c: 3 }; // => { a: 1, b: 2, c: 3 };

Rest:
    const { a, ...b } = data; // const a = 1, b = { b: 2, c: 3 };

RegExp Named Capture Groups:
    const result = /^(?<cafe>\d+)\/(?<babe>\d+)$/u.exec("3/11"); // => […, groups: { cafe: "3", babe: "11" }];


# ES2019
Object.fromEntries:
    Object.fromEntries([["a", 1], ["b", 2]]); // => { a: 1, b: 2 };

String.trimStart:
    "   asdf ".trimStart(); => "asdf ";

String.trimEnd:
    "   asdf ".trimEnd(); => "   asdf";

Optional catch variable:
    try { … } catch { … }; // without "catch (e)"


# ES2020
BigInt:
    const a = BigInt(123456789012345678901234567890);
    const b = 123456789012345678901234567890n;

Optional chaining:
    obj?.prop;
    obj?.func?.();
    arr?.[index];

Nullish Coalescing:
    "" ?? "stuff"; // => "";
    0 ?? 123; // => 0;
    null ?? 1; // => 1;
    undefined ?? "qwer"; // => "qwer";


# ES2021
Shorthands:
    i += 3;     // i = i + 3;
    i ||= true; // i = i || true;
    i &&= true; // i = i && true;
    i ??= 1;    // i = i ?? 1;

Numeric Separators:
    10_000_000_000_00;
    0xab_cd_ef_gh;
    0b1010_1110_0001_0011;

String.replaceAll:
    "affenbande".replaceAll("a", 4); // => "4ffenb4nde";


















# CSS
@media (hover: hover)       // non-touch
@media (hover: none)        // touch
@media (pointer: coarse)    // finger
@media (pointer: fine)      // mouse or stylus

scroll-behavior: smooth;    // scrollTo and anchors perform a smooth transition
scroll-padding-*: ;         // define how much is visible around when scrolled
