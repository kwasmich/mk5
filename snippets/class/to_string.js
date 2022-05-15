class MyClass {
    constructor() {
        Object.seal(this);
    }

    toString() {
        return "affe"
    }
}

const instance = new MyClass();

console.log("" + instance);
