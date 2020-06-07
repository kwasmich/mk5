export default class Observable {
    constructor() {
        this._value = undefined;
        this._observer = new Set();
        Object.seal(this);
    }

    subscribe(observer) {
        this._observer.add(observer);
        // console.log(this._observer, observer);
        observer(this._value);
    }

    unsubscribe(observer) {
        this._observer.delete(observer);
        // console.log(this._observer, observer);
    }

    set value(newValue) {
        this._value = newValue;

        for (const observer of this._observer) {
            observer(this._value);
        }
    }

    get value() {
        return this._value;
    }
}
