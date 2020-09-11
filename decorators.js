export const tag = function(selector) {
    return function(target) {
        console.log(target, selector);
    }
}

export const template = function(tpl) {
    return function(target) {
        console.log(target, tpl);
    }
}
