const _IconMap = {
    "Attic":        "/hue/assets/HueIconPack2019/roomsAttic.svg",
    "Balcony":      "/hue/assets/HueIconPack2019/roomsBalcony.svg",
    "Barbecue":     "/hue/assets/HueIconPack2019/.svg",
    "Bathroom":     "/hue/assets/HueIconPack2019/roomsBathroom.svg",
    "Bedroom":      "/hue/assets/HueIconPack2019/roomsBedroom.svg",
    "Carport":      "/hue/assets/HueIconPack2019/roomsCarport.svg",
    "Closet":       "/hue/assets/HueIconPack2019/roomsCloset.svg",
    "Computer":     "/hue/assets/HueIconPack2019/roomsComputer.svg",
    "Dining":       "/hue/assets/HueIconPack2019/roomsDining.svg",
    "Downstairs":   "/hue/assets/HueIconPack2019/.svg",
    "Driveway":     "/hue/assets/HueIconPack2019/roomsDriveway.svg",
    "Front door":   "/hue/assets/HueIconPack2019/roomsFrontdoor.svg",
    "Garage":       "/hue/assets/HueIconPack2019/roomsGarage.svg",
    "Garden":       "/hue/assets/HueIconPack2019/.svg",
    "Guest room":   "/hue/assets/HueIconPack2019/roomsGuestroom.svg",
    "Gym":          "/hue/assets/HueIconPack2019/roomsGym.svg",
    "Hallway":      "/hue/assets/HueIconPack2019/roomsHallway.svg",
    "Home":         "/hue/assets/HueIconPack2019/.svg",
    "Kids bedroom": "/hue/assets/HueIconPack2019/roomsKidsbedroom.svg",
    "Kitchen":      "/hue/assets/HueIconPack2019/roomsKitchen.svg",
    "Laundry room": "/hue/assets/HueIconPack2019/roomsLaundryroom.svg",
    "Living room":  "/hue/assets/HueIconPack2019/roomsLiving.svg",
    "Lounge":       "/hue/assets/HueIconPack2019/roomsLounge.svg",
    "Man cave":     "/hue/assets/HueIconPack2019/roomsMancave.svg",
    "Music":        "/hue/assets/HueIconPack2019/otherMusic.svg",
    "Nursery":      "/hue/assets/HueIconPack2019/roomsNursery.svg",
    "Office":       "/hue/assets/HueIconPack2019/roomsOffice.svg",
    "Other":        "/hue/assets/HueIconPack2019/roomsOther.svg",
    "Pool":         "/hue/assets/HueIconPack2019/roomsPool.svg",
    "Porch":        "/hue/assets/HueIconPack2019/roomsPorch.svg",
    "Reading":      "/hue/assets/HueIconPack2019/.svg",
    "Recreation":   "/hue/assets/HueIconPack2019/roomsRecreation.svg",
    "Staircase":    "/hue/assets/HueIconPack2019/roomsStaircase.svg",
    "Storage":      "/hue/assets/HueIconPack2019/roomsStorage.svg",
    "Studio":       "/hue/assets/HueIconPack2019/roomsStudio.svg",
    "Terrace":      "/hue/assets/HueIconPack2019/roomsTerrace.svg",
    "Toilet":       "/hue/assets/HueIconPack2019/roomsToilet.svg",
    "Top floor":    "/hue/assets/HueIconPack2019/.svg",
    "TV":           "/hue/assets/HueIconPack2019/.svg",
    "Upstairs":     "/hue/assets/HueIconPack2019/.svg",
};
Object.seal(_IconMap);

export const IconMap = _IconMap;



// https://developers.meethue.com/develop/application-design-guidance/color-conversion-formulas-rgb-to-xy-and-back/
export function xy2rgb(x, y, bri) {
    const z = 1.0 - x - y;
    const Y = bri / 254;
    const X = (Y / y) * x;
    const Z = (Y / y) * z;
    let r = +X * 1.656492 - Y * 0.354851 - Z * 0.255038;
    let g = -X * 0.707196 + Y * 1.655397 + Z * 0.036152;
    let b = +X * 0.051713 - Y * 0.121364 + Z * 1.011530;
    r = r <= 0.0031308 ? 12.92 * r : (1.0 + 0.055) * Math.pow(r, (1.0 / 2.4)) - 0.055;
    g = g <= 0.0031308 ? 12.92 * g : (1.0 + 0.055) * Math.pow(g, (1.0 / 2.4)) - 0.055;
    b = b <= 0.0031308 ? 12.92 * b : (1.0 + 0.055) * Math.pow(b, (1.0 / 2.4)) - 0.055;
    r *= 255;
    g *= 255;
    b *= 255;
    return { r, g, b };
}



// https://gist.github.com/paulkaplan/5184275
export function ct2rgb(ct) {
    const m = (2000 - 6500) / (500 - 153);
    const b = (-153 * m + 6500);
    const kelvin = m * ct + b;
    const temp = kelvin / 100;
    let red, green, blue;

    if (temp <= 66) {
        red = 255;
        green = temp;
        green = 99.4708025861 * Math.log(green) - 161.1195681661;

        if (temp <= 19) {
            blue = 0;
        } else {
            blue = temp - 10;
            blue = 138.5177312231 * Math.log(blue) - 305.0447927307;
        }
    } else {
        red = temp - 60;
        red = 329.698727446 * Math.pow(red, -0.1332047592);
        green = temp - 60;
        green = 288.1221695283 * Math.pow(green, -0.0755148492);
        blue = 255;
    }

    return {
        r: clamp(red, 0, 255),
        g: clamp(green, 0, 255),
        b: clamp(blue, 0, 255)
    }

}



function clamp(x, min, max) {
    if (x < min) { return min; }
    if (x > max) { return max; }
    return x;
}
