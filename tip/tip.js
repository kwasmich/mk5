
window.addEventListener('load', doit);


const SVG_NS = "http://www.w3.org/2000/svg";


function rndVertex() {
    // const r = Math.sqrt(Math.random()) * Math.sqrt(2);
    // const phi = Math.random() * Math.PI * 2;
    // const x = r * Math.cos(phi) * 0.5 + 0.5;
    // const y = r * Math.sin(phi) * 0.5 + 0.5;
    // return [clamp(x, 0, 1), clamp(y, 0, 1)];
    return [Math.random(), Math.random()];
}


function constrainVertex(v) {
    v[0] = clamp(v[0], 0, 1);
    v[1] = clamp(v[1], 0, 1);
}



// const pointFactory = () => {
//     return [...Array(300)].map(() => rndVertex());
// };


function normalRandom() {
    // https://riptutorial.com/javascript/example/8330/random--with-gaussian-distribution
    return (Math.random() + Math.random() + Math.random() + Math.random()) / 2 - 1;
    // https://newbedev.com/javascript-math-random-normal-distribution-gaussian-bell-curve
    let u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) return normalRandom(); // resample between 0 and 1
    return num;
}


const mutate = (popEl, mutated) => {
    const rate = 0.01;
    const amount = 0.3;

    for (let i = 4; i < popEl.vertices.length; i++) {
        if (Math.random() < rate) {
            // const old = [...vertices[i]];
            popEl.vertices[i][0] += normalRandom() * amount * 0.5;
            popEl.vertices[i][1] += normalRandom() * amount * 0.5;
            constrainVertex(popEl.vertices[i]);
            // mutated({ old, new: vertices[i], index: i });
        }

        if (Math.random() < rate * rate) {
            popEl.vertices[i] = rndVertex();
        }

        // if (Math.random() < rate) {
        //     popEl.vertices[i][0] = clamp(popEl.vertices[i][0] + (Math.random() * 2 - 1) / 200, 0, 1);
        //     popEl.vertices[i][1] = clamp(popEl.vertices[i][1] + (Math.random() * 2 - 1) / 200, 0, 1);
        // }
    }

    popEl.error = undefined;
    popEl.triangles = undefined;
};


function doit() {
    // fetch("rushmore.tri").then((resp) => resp.arrayBuffer()).then(buffer => render(buffer));
    const img = new Image();
    img.src = "rushmore.jpg";
    img.onload = () => compute(img);
}


function drawDot(canvas, [x, y]) {
    const radius = 3;
    const ctx = canvas.getContext("2d",);

    ctx.beginPath();
    ctx.arc(x * canvas.width, y * canvas.height, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'lime';
    ctx.fill();
}


function clamp(a, min, max) {
    return Math.max(Math.min(a, max), min);
}


function clonePopEl(popEl) {
    const vertices = popEl.vertices.map((v) => [...v]);
    const triangles = Uint32Array.from(popEl.triangles);
    const error = popEl.error;
    return { vertices, triangles, error };
}


function compute(img) {
    const backBuffer = document.querySelector("canvas#back");
    // const backBuffer = document.createElement("canvas"); // pretty slow: new OffscreenCanvas(img.width / 8, img.height / 8);
    backBuffer.width = img.width / 8;
    backBuffer.height = img.height / 8;
    const ctxBack = backBuffer.getContext("2d", { willReadFrequently: true });
    const frontBuffer = document.querySelector("canvas#front");
    frontBuffer.width = img.width;
    frontBuffer.height = img.height;
    const ctxFront = frontBuffer.getContext("2d");
    ctxBack.fillStyle = "#088";
    ctxBack.fillRect(0, 0, backBuffer.width, backBuffer.height)
    // ctxBack.filter("blur(8px)");
    ctxBack.imageSmoothingQuality = "high";
    ctxBack.drawImage(img, 0, 0, backBuffer.width, backBuffer.height);
    const srcPixel = ctxBack.getImageData(0, 0, backBuffer.width, backBuffer.height);
    
    const strideX = 4;
    const strideY = strideX * backBuffer.width;
    const POPULATION_SIZE = 400;
    const CUT_OFF = 5;  // 5 elements of the first population always survive without mutation

    const newPopulationElement = () => {
        const vertices = [[0, 0], [1, 0], [0, 1], [1, 1]];
    
        for (let i = 0; i < 1156; i++) {
            vertices.push(rndVertex());
        }

        return { vertices, triangles: undefined, error: undefined };
    };

    let population = [...Array(POPULATION_SIZE)].map(() => newPopulationElement());
    
    let prevError = Number.MAX_SAFE_INTEGER;

    const render = (ctx, canvas, {triangles, vertices}) => {
        for (let i = 0; i < triangles.length; i += 3) {
            const p0 = [vertices[triangles[i+0]][0] * (backBuffer.width - 1), vertices[triangles[i+0]][1] * (backBuffer.height - 1)];
            const p1 = [vertices[triangles[i+1]][0] * (backBuffer.width - 1), vertices[triangles[i+1]][1] * (backBuffer.height - 1)];
            const p2 = [vertices[triangles[i+2]][0] * (backBuffer.width - 1), vertices[triangles[i+2]][1] * (backBuffer.height - 1)];
            const px = [(p0[0] + p1[0] + p2[0]) / 3, (p0[1] + p1[1] + p2[1]) / 3];
            const p01 = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
            const p02 = [(p0[0] + p2[0]) / 2, (p0[1] + p2[1]) / 2];
            const p12 = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
            const coords = [p0, p1, p2, px, p01, p12, p02];
            const cLen = coords.length;

            const color = coords.reduce((acc, p) => {
                const x = Math.floor(p[0]);
                const y = Math.floor(p[1]);
                const index = x * strideX + y * strideY;
                const data = srcPixel.data.slice(index, index + 4);
                return [acc[0] + data[0], acc[1] + data[1], acc[2] + data[2], acc[3] + data[3]];
            }, [0, 0, 0, 0]);
            
            const v0 = [vertices[triangles[i+0]][0] * (canvas.width - 1), vertices[triangles[i+0]][1] * (canvas.height - 1)];
            const v1 = [vertices[triangles[i+1]][0] * (canvas.width - 1), vertices[triangles[i+1]][1] * (canvas.height - 1)];
            const v2 = [vertices[triangles[i+2]][0] * (canvas.width - 1), vertices[triangles[i+2]][1] * (canvas.height - 1)];

            const rgba = `rgba(${color[0] / cLen}, ${color[1] / cLen}, ${color[2] / cLen}, ${color[3] / cLen / 255})`;
            ctx.fillStyle = rgba;
            ctx.strokeStyle = rgba;
            // ctx.fillStyle = "#f0f";
            ctx.beginPath();
            ctx.moveTo(...v0);
            ctx.lineTo(...v1);
            ctx.lineTo(...v2);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
        }
    }

    const error1 = ({vertices, triangles}, canvas) => {
        let error = 0;
    
        for (let i = 0; i < triangles.length; i += 3) {
            const p0 = [vertices[triangles[i+0]][0] * (canvas.width - 1), vertices[triangles[i+0]][1] * (canvas.height - 1)];
            const p1 = [vertices[triangles[i+1]][0] * (canvas.width - 1), vertices[triangles[i+1]][1] * (canvas.height - 1)];
            const p2 = [vertices[triangles[i+2]][0] * (canvas.width - 1), vertices[triangles[i+2]][1] * (canvas.height - 1)];
            const px = [(p0[0] + p1[0] + p2[0]) / 3, (p0[1] + p1[1] + p2[1]) / 3];
            const p01 = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
            const p02 = [(p0[0] + p2[0]) / 2, (p0[1] + p2[1]) / 2];
            const p12 = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
            const coords = [p0, p1, p2, px, p01, p12, p02];

            const color = coords.reduce((acc, p) => {
                const x = Math.floor(p[0]);
                const y = Math.floor(p[1]);
                const index = x * strideX + y * strideY;
                const data = srcPixel.data.slice(index, index + 4);
                return [acc[0] + data[0], acc[1] + data[1], acc[2] + data[2], acc[3] + data[3]];
            }, [0, 0, 0, 0]);

            error += coords.reduce((acc, p) => {
                const x = Math.floor(p[0]);
                const y = Math.floor(p[1]);
                const index = x * strideX + y * strideY;
                const data = srcPixel.data.slice(index, index + 4);
                return acc
                + (data[0] - color[0]) * (data[0] - color[0])
                + (data[1] - color[1]) * (data[1] - color[1])
                + (data[2] - color[2]) * (data[2] - color[2]);
            }, 0);
        }

        return error;
    }

    const error2 = (ctx, popEl) => {
        render(ctx, backBuffer, popEl);
        const evaluate = ctx.getImageData(0, 0, backBuffer.width, backBuffer.height);
        const error = srcPixel.data.reduce((acc, p, idx) => acc + Math.abs(p - evaluate.data[idx]) * Math.abs(p - evaluate.data[idx]), 0);
        return error;
    }

    const calculateError = () => {
        for (const p of population) {
            if (!p.triangles) {
                const delaunay = Delaunator.from(p.vertices);
                const triangles = delaunay.triangles;
                p.triangles = triangles;
            }

            p.error = error2(ctxBack, p, backBuffer);
        }
    };

    const newGeneration = () => {
        let i = 0;

        for (i = 0; i < CUT_OFF; i++) {
            newPopulation[i] = clonePopEl(population[i]);
        }

        while (i < POPULATION_SIZE) {
            for (let j = 0; j < CUT_OFF && i < POPULATION_SIZE; j++) {
                newPopulation[i] = clonePopEl(population[j]);
                mutate(newPopulation[i]);
                i++;
            }
        }

        const tmp = population;
        population = newPopulation;
        newPopulation = tmp;
    };

    console.time("error");
    calculateError();
    console.timeEnd("error");
    let newPopulation = [];
    population.sort((a, b) => a.error - b.error);
    let best = clonePopEl(population[0]);

    render(ctxFront, frontBuffer, best);

    // for (const v of best.vertices) {
    //     drawDot(frontBuffer, v);
    // }

    const retry = () => {
        console.time('iteration');

        newGeneration();
        calculateError();

        population.sort((a, b) => a.error - b.error);
        best = clonePopEl(population[0]);

        render(ctxFront, frontBuffer, best);

        // for (const v of best.vertices) {
        //     drawDot(ctx, canvas, v);
        // }

        // setTimeout(requestAnimationFrame, 1000, retry);
        requestAnimationFrame(retry);
        console.timeEnd('iteration');
    }

    requestAnimationFrame(retry);
}


function render(buffer) {
    if (buffer) {
        var data = new DataView(buffer);
        let triangles = parseData(data);
        let width = data.getUint16(0, true);
        let height = data.getUint16(2, true);

        const canvas = document.querySelector("canvas");
        canvas.width = width;
        canvas.height = height;
        renderToCanvas(canvas, triangles);

        const svg = document.querySelector("svg");
        svg.style.width = width + "px";
        svg.style.height = height + "px";
        renderToSVG(svg, triangles);

        // let i = 0;

        // const draw = () => {
        //     i++;
        //     renderToCanvas(canvas, triangles);
        //     renderToSVG(svg, triangles, i);

        //     if (i < triangles.length) {
        //         requestAnimationFrame(draw);
        //     }
        // }

        // requestAnimationFrame(draw);
    }
}



function renderToCanvas(canvas, triangles, length = Number.MAX_SAFE_INTEGER) {

    var ctx = canvas.getContext("2d");

    ctx.fillStyle = "#088";
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    // ctx.clearRect(0, 0, canvas.width, canvas.height);

    const end = Math.min(length, triangles.length);

    for (var i = 0; i < end; i++) {
        let triangle = triangles[i].triangle;
        let color = triangles[i].color;
        let rgb = `rgba(${color.join()}, 1)`;

        ctx.fillStyle = rgb;
        ctx.strokeStyle = rgb;
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(...triangle[0]);
        ctx.lineTo(...triangle[1]);
        ctx.lineTo(...triangle[2]);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
    }
}

function renderToSVG(svg, triangles, length = Number.MAX_SAFE_INTEGER) {
    while (svg.children.length) {
        svg.firstChild.remove();
    }

    const rect = document.createElementNS(SVG_NS, "rect");
    rect.setAttribute("fill", "#f0f");
    rect.setAttribute("width", svg.clientWidth);
    rect.setAttribute("height", svg.clientHeight);
    svg.appendChild(rect);
    svg.setAttribute("stroke-width", 1);

    const end = Math.min(length, triangles.length);

    for (var i = 0; i < end; i++) {
        let triangle = triangles[i].triangle;
        let color = triangles[i].color;
        const rgb = `rgb(${color.join()})`;

        const path = document.createElementNS(SVG_NS, "path");
        path.setAttribute("fill", rgb);
        path.setAttribute("stroke", rgb);
        
        const d = `M ${triangle[0]} L ${triangle[1]} L ${triangle[2]} Z`;
        path.setAttribute("d", d);
        svg.appendChild(path);
    }

    // second pass to smoothen out the line artifacts
    for (var i = 0; i < end; i++) {
        let triangle = triangles[i].triangle;
        let color = triangles[i].color;
        const rgb = `rgb(${color.join()})`;

        const path = document.createElementNS(SVG_NS, "path");
        path.setAttribute("fill", rgb);
        // path.setAttribute("stroke", rgb);
        
        const d = `M ${triangle[0]} L ${triangle[1]} L ${triangle[2]} Z`;
        path.setAttribute("d", d);
        svg.appendChild(path);
    }

    // console.log(svg.outerHTML);
}

function parseData(data) {
    var triangles = [];

    triangles.push({
        triangle: [
            [data.getUint16(5, true), data.getUint16(7, true)],
            [data.getUint16(9, true), data.getUint16(11, true)],
            [data.getUint16(13, true), data.getUint16(15, true)],
        ],
        color: [data.getUint8(17, true), data.getUint8(18, true), data.getUint8(19, true)],
        remaining: data.getUint8(4, true),
    });

    var current = 0;

    for (var i = 20; i < data.byteLength;) {
        let parent = triangles[current];

        let dataByte = data.getUint8(i, true);

        i++;
        let face = (dataByte >> 2) & 3;

        let adjacent = triangles[current].triangle;

        var vertex;

        if ((dataByte >> 4) & 1) {
            vertex = [parent.triangle[face][0] + data.getInt8(i, true), parent.triangle[face][1] + data.getInt8(i + 1, true)];
            i += 2;
        } else {
            vertex = [data.getUint16(i, true), data.getUint16(i + 2, true)];
            i += 4;
        }

        var color;

        if ((dataByte >> 5) & 1) {
            let colorData = data.getUint16(i, true);

            color = [parent.color[0] + (colorData & 63) - 32, parent.color[1] + ((colorData >> 6) & 63) - 32, parent.color[2] + (((colorData >> 12) & 15) | ((dataByte >> 6) & 3) << 4) - 32];
            i += 2;
        } else {
            color = [data.getUint8(i, true), data.getUint8(i + 1, true), data.getUint8(i + 2, true)];
            i += 3;
        }

        let triangle = [
            adjacent[face],
            adjacent[(face + 1) % 3],
            vertex,
        ].sort(function (a, b) {
            if (a[1] == b[1]) {
                return a[0] - b[0];
            }

            return a[1] - b[1];
        });

        triangles.push({
            triangle: triangle,
            color: color,
            remaining: dataByte & 3,
        });

        triangles[current].remaining--;
        while (triangles[current] && triangles[current].remaining == 0) {
            current++;
        }
    }

    // let width = data.getUint16(0, true);
    // let height = data.getUint16(2, true);
    // triangles.forEach((tri) => tri.triangle = tri.triangle.map((y) => {
    //     // console.log(...y);
    //     // y[0] = Math.floor(y[0] * 256 / width);
    //     // y[1] = Math.floor(y[1] * 256 / height);
    //     // console.log(...y);
    //     return [Math.floor(y[0] * 256 / width) * width / 256, Math.floor(y[1] * 256 / height) * height / 256];
    // }));
    // triangles.forEach((tri) => console.log(tri));
    return triangles;
}

// {triangle: [[129, 120], [126, 124], [128, 126]], color: [59, 51, 46], remaining: 3}
// {triangle: [[27, 37], [126, 124], [27, 39]], color: [59, 51, 46], remaining: 2} (tip.js, line 204)
// {triangle: [[27, 37], [131, 124], [27, 39]], color: [176, 160, 150], remaining: 2} (tip.js, line 204)