async function init() {
    try {
        const env = await (await fetch("/.env.json")).json();
        globalThis.env = env;
    } catch { }
}

init();
