
window.addEventListener('load', doit);


const SVG_NS = "http://www.w3.org/2000/svg";


function doit() {
    fetch("rushmore.tri").then((resp) => resp.arrayBuffer()).then(buffer => render(buffer));
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

    let width = data.getUint16(0, true);
    let height = data.getUint16(2, true);
    triangles.forEach((tri) => tri.triangle = tri.triangle.map((y) => {
        // console.log(...y);
        // y[0] = Math.floor(y[0] * 256 / width);
        // y[1] = Math.floor(y[1] * 256 / height);
        // console.log(...y);
        return [Math.floor(y[0] * 256 / width) * width / 256, Math.floor(y[1] * 256 / height) * height / 256];
    }));
    triangles.forEach((tri) => console.log(tri));
    return triangles;
}

// {triangle: [[129, 120], [126, 124], [128, 126]], color: [59, 51, 46], remaining: 3}
// {triangle: [[27, 37], [126, 124], [27, 39]], color: [59, 51, 46], remaining: 2} (tip.js, line 204)
// {triangle: [[27, 37], [131, 124], [27, 39]], color: [176, 160, 150], remaining: 2} (tip.js, line 204)