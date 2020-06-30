




NodeList.prototype.toArray = function () {
    return Array.prototype.slice.call(this);
};


HTMLCollection.prototype.toArray = function () {
    return Array.prototype.slice.call(this);
};

var g_hue, g_svg;

function embed(ELEMENT, INDEX, ARRAY) {
    var url, loadHandler, xhr, content;

    url = ELEMENT.getAttribute("src");

    loadHandler = function (EVENT) {
        var response, div, newElement;

        if (EVENT.target.status === 200 || EVENT.target.status === 0) {
            response = EVENT.target.responseText;
            div = document.createElement("DIV");
            div.innerHTML = response;
            newElement = div.firstElementChild;
            ELEMENT.parentNode.replaceChild(newElement, ELEMENT);
        } else {
            console.error("The file to be included could not be loaded.", url);
        }
    };

    xhr = new XMLHttpRequest();
    xhr.onload = loadHandler;
    xhr.open("GET", url, false);
    xhr.send(null);
}


function embedTemplates(ROOT) {
    var embeds;

    embeds = ROOT.querySelectorAll("mk-include").toArray();
    embeds.forEach(embed);
}


function clickHandler(EVENT) {
    // console.log(EVENT.currentTarget.id);
}


function register(ELEMENT, INDEX, ARRAY) {
    ELEMENT.onclick = clickHandler;
}


function xy2rgb(XY, BRIGHTNESS) {
    var x = XY[0]; // the given x value
    var y = XY[1]; // the given y value
    var z = 1.0 - x - y;
    var Y = BRIGHTNESS;
    var X = (Y / y) * x;
    var Z = (Y / y) * z;
    var r =  X * 1.656492 - Y * 0.354851 - Z * 0.255038;
    var g = -X * 0.707196 + Y * 1.655397 + Z * 0.036152;
    var b =  X * 0.051713 - Y * 0.121364 + Z * 1.011530;

    if (r > b && r > g && r > 1.0) {
        // red is too big
        g = g / r;
        b = b / r;
        r = 1.0;
    }
    else if (g > b && g > r && g > 1.0) {
        // green is too big
        r = r / g;
        b = b / g;
        g = 1.0;
    }
    else if (b > r && b > g && b > 1.0) {
        // blue is too big
        r = r / b;
        g = g / b;
        b = 1.0;
    }

    r = r <= 0.0031308 ? 12.92 * r : (1.0 + 0.055) * Math.pow(r, (1.0 / 2.4)) - 0.055;
    g = g <= 0.0031308 ? 12.92 * g : (1.0 + 0.055) * Math.pow(g, (1.0 / 2.4)) - 0.055;
    b = b <= 0.0031308 ? 12.92 * b : (1.0 + 0.055) * Math.pow(b, (1.0 / 2.4)) - 0.055;

    if (r > b && r > g) {
        // red is biggest
        if (r > 1.0) {
            g = g / r;
            b = b / r;
            r = 1.0;
        }
    }
    else if (g > b && g > r) {
        // green is biggest
        if (g > 1.0) {
            r = r / g;
            b = b / g;
            g = 1.0;
        }
    }
    else if (b > r && b > g) {
        // blue is biggest
        if (b > 1.0) {
            r = r / b;
            g = g / b;
            b = 1.0;
        }
    }

    return [r * 255, g * 255, b * 255];
}


function hsb2rgb(HUE, SATURATION, BRIGHTNESS) {
    var c = (BRIGHTNESS / 255) * (SATURATION / 255);
    var h = Math.floor(HUE * 6 / 65536);
    var x = c * (1 - Math.abs(((HUE * 6 / 65536 ) % 2) - 1));
    var m = (BRIGHTNESS / 255) - c;
    var rgb;

    switch (h) {
        case 0:
            rgb = [c, x, 0];
            break;

        case 1:
            rgb = [x, c, 0];
            break;

        case 2:
            rgb = [0, c, x];
            break;

        case 3:
            rgb = [0, x, c];
            break;

        case 4:
            rgb = [x, 0, c];
            break;

        case 5:
            rgb = [c, 0, x];
            break;
    }
    
    rgb[0] += m;
    rgb[1] += m;
    rgb[2] += m;
    
    rgb[0] = Math.round(rgb[0] * 255);
    rgb[1] = Math.round(rgb[1] * 255);
    rgb[2] = Math.round(rgb[2] * 255);
    return rgb;
}


function callback(DATA) {
    var index, light, lightRing, lightCone, lightGradient, lightStopColors, lightColor;

    for (index in DATA) {
        light = DATA[index]["state"];
        //console.log(light);
        lightCone = g_svg.querySelector("[id=light_" + index + "]");
        lightRing = g_svg.querySelector("[id=ring_" + index + "]");
        lightGradient = g_svg.querySelector("[id=radialGradient_" + index + "]");
        lightStopColors = g_svg.querySelectorAll("[id=radialGradient_" + index + "] > stop");

        if (lightCone) {
            if (light["on"] && light["reachable"]) {
                lightColor = [0, 0, 0];

                if (light["colormode"] === "xy") {
                    lightColor = xy2rgb(light["xy"], 1);
                }

                if (light["colormode"] === "hs") {
                    lightColor = hsb2rgb(light["hue"], light["sat"], 255);
                }

                if (light["colormode"] === "ct") {
                    var a = (light["ct"] - 153) / (500 - 153);
                    lightColor[0] = a * 255 + (1 - a) * 191;
                    lightColor[1] = a * 223 + (1 - a) * 191;
                    lightColor[2] = a * 63 + (1 - a) * 255;
                }

                lightColor[0] = Math.round(lightColor[0]);
                lightColor[1] = Math.round(lightColor[1]);
                lightColor[2] = Math.round(lightColor[2]);

                lightRing.style.stroke = "rgb(" + lightColor[0] + ", " + lightColor[1] + ", " + lightColor[2] + ")";
                lightRing.style.strokeDasharray = "none";

                for (var i = 0; i < lightStopColors.length; i++) {
                    lightStopColors[i].style.stopColor = "rgb(" + lightColor[0] + ", " + lightColor[1] + ", " + lightColor[2] + ")";
                }

                lightCone.style.fillOpacity = 1;
                lightCone.setAttribute("r", 150 * (light["bri"] + 64) / 320);
                lightGradient.setAttribute("r", 150 * (light["bri"] + 64) / 320);
                lightCone.style.fill = "#ffffff";
                lightCone.style.fill = "url(#radialGradient_" +  index + ")";
            } else {
                lightCone.style.fillOpacity = 0;
                lightRing.style.strokeDasharray = "2, 3";

                if (light["reachable"]) {
                    lightRing.style.stroke = "#FFFFFF";
                } else {
                    lightRing.style.stroke = "#FF0000";
                }
            }
        }
    }
}


function timer() {
    g_hue.query("GET", ["lights"], null, callback);
}


function init(EVENT) {
    var svg, touchAreas;

    embedTemplates(document.body);
    svg = document.querySelector("svg");
    touchAreas = svg.querySelectorAll("[id^=touch_]").toArray();
    touchAreas.forEach(register);

    g_hue = new Hue("kwasi-hue.local", "kwasihueremote");
    g_svg = svg;

    setInterval(timer, 1000);
}



window.onload = init;