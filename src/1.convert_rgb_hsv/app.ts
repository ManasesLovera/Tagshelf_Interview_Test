/*
1. Escriba una implementación de conversión de las siguientes representaciones:
    a. RGB a HSV
    b. HSV a RGB

Consideraciones tomar en cuenta:
    ● Sin ramas (evaluaciones de condiciones).
    ● Preferiblemente utilizando instrucciones de SIMD.
    ● Que soporte un alto número de conversiones.
    ● Tenga en cuenta las opciones de diseño específicas para su elección de
    hardware.

Ver: http://en.wikipedia.org/wiki/HSV_color_space
*/

/*
I could say I had a hard time understanding this one, it may be easy to follow the formula but I wanted to understand
how and why the formula was that way, it took me more time that I thought, but I finally understood this problem.

First steps was understanding what RGB is, which I am already familiar with, (red, green, blue), very easy, but when I saw
HSV it took me more time to understand what actually is and the difference between RGB and HSV.

So basically HSV stands for (Hue, Saturation, Value)
    Hue: is the color, it goes from 0 to 360, it goes to every color through that, example 0 is red, 60 is yellow, 120 is green, etc...
    Saturation: this one was easier to understand, since I've seen in editing my photos using my phone
    Value: also easy to understand, it's just the brightness of the color, both S and V have a range from 0 to 1
    where 0 is gray and 1 full color for the S, and 0 is black and 1 is full brightness for the V
*/

function rgbToHsv(r: number, g: number, b: number) : [number, number, number] 
{
    // So, I resolved this problem following the formula
    /* First step is normalize RGB values, from the range 0 to 255, let's go to 0 to 1, yeah I know Hue is from 0 to 360 but 
    we will take care of that soon. */
    r /= 255;
    g /= 255;
    b /= 255;

    // Here we are calculating the chroma, is just the difference between the max and min value of RGB, and we will using this
    // for the formula
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const chroma = max - min;

    // the H or Hue value will change depending on the max of RGB, remember it's a different color depending on the number
    // the same number could represent different colors from 0 to 360

    /*
    So basically the formula is:
    if max = r
        H = 60 x ((g - b) / C) // C is the Chroma
    if max = g
        H = 60 x ((b - r) / C + 2) 
    if max = b
        H = 60 x ((r - g) / C + 4) 
    */

    // Here you can see the approach I did according to the formula

    let rMax = ((g - b) / chroma) * Math.floor(r / max);
    let gMax = ((b - r) / chroma + 2) * Math.floor(g / max);
    let bMax = ((r - g) / chroma + 4) * Math.floor(b / max);

    let h = 60 * (rMax + gMax + bMax);

    // This is the code I had before, but then realized I was not able to use ternary operators
    // let h = 60 * (
    //     max === r ? ((g - b) / chroma) :
    //     max === g ? ((b - r) / chroma + 2) :
    //     max === b ? ((r - g) / chroma + 4) : 0
    // );

    // Do you remember the fix to the Hue since it's from 0 to 360? Here is the way we make the magic so we ensure is in the correct range
    h = (h + 360) % 360;

    // Now that we did all the hard part both S and V are vary easy, S is just chrome / max, and V is just the max XD
    // Since the max could be 0, I did this because as you know we can't divide by zero, I had another ternary operator here,
    // and this code prevent the exception if max is 0
    let s;
    try {
        s = chroma / max;
    }
    catch(e) {
        s = 0
    }
        
    const V = max;

    // and that's all
    // Now we just return all that and we are DONE

    return [h, s, V];
}

function hsvToRgb(h: number, s: number, v: number) : [number, number, number] 
{
    /*
    Well... we already know what HSV stands for,  to solve this... first we need to calculate some values for the formula
    Chroma: C = V x S
    X (helps adjust the RGB values based on the hue):
        X = C x ( 1 - | (H/60 mod 2) -1 |)
    M (adjusts the brightness of the color):
        M = V - C

    Here you can see the way I... did it, my approach
    */
    // Before... we should normalize the Hue to [0, 360) that way if we receive something out of that range it will change accordingly
    h = h % 360;

    // Very easy right? I don't need to explain it again I think
    const c = v * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = v - c;

    // With this we determine the hue sector, it is devided into 6, each representing a primary or secondary color.
    const hIndex = Math.floor(h / 60) % 6;

    // For not using an if, switch or ternary op I did an array looking for the index
    const rArray = [c, x, 0, 0, x, c]
    const gArray = [x, c, c, x, 0, 0]
    const bArray = [0, 0, c, c, x, x]

    const r = rArray[hIndex]
    const g = gArray[hIndex]
    const b = bArray[hIndex]

    // Last! We convert 0 to 1 range to 0 to 255 and round to integers (according to the formula) B)
    return [
        Math.round((r + m) * 255),
        Math.round((g + m) * 255),
        Math.round((b + m) * 255)
    ];
}

console.log(rgbToHsv(255,0,0)); // This should return [ 0, 1, 1 ] remember S and V are represented by percentage, 1 means 100%
console.log(hsvToRgb(0, 1, 1)); // This should return [ 255, 0, 0 ] same as the previous message, 1 means 100%
                                // it would be easy to change the formula if you want to add 100 instead of 1
/*
Must mention the websites where I got the formulas hehe:

RGB to HSV: https://www.rapidtables.com/convert/color/rgb-to-hsv.html
HSV to RGB: https://www.rapidtables.com/convert/color/hsv-to-rgb.html
*/