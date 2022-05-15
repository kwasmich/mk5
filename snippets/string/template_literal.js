const person = 'Mike';
const age = 128;

function myTag(strings, personExp, ageExp, ...args) {
    console.log(args);
    // return "hello";
    const str0 = strings[0]; // "That "
    const str1 = strings[1]; // " is a "
    const str2 = strings[2]; // "."

    const ageStr = (ageExp > 99) ? 'centenarian' : 'youngster';

    // We can even return a string built using a template literal
    return `${str0}${personExp}${str1}${ageStr}${str2}`;
}

const output = myTag`That ${ person } is a ${ age }.`;

console.log(output);
