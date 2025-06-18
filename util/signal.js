let Observer = null;



export function createSignal(value) {
    const observers = new Set();

    return [
        () => {
            if (Observer) observers.add(Observer);
            return value;
        },
        (newValue) => {
            value = newValue;
            if (observers.has(Observer)) throw new Error('Cannot change Value of Signal inside an Effect!');
            observers.forEach((o) => o());
        }
    ];
}



export function createEffect(fn) {
    function compute() {
        try {
            Observer = compute;
            fn();
        } finally {
            Observer = null;
        }
    }
    
    return compute();
}
