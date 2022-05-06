// Global Variables and selections
const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll("input[type=range]");
const currentHexes = document.querySelectorAll(".color h2");

// Functions

// Generating Hex Codes with plain Javascript

// function generateHex() {
//     const letters = "0123456789ABCDEF";
//     let hash =  "#";
//     for(let i = 0; i<6; i++) {
//         hash+=letters[Math.floor(Math.random() * 16)];
//     }
//     return hash;
// }

// Generating Hex Codes using Chroma Js Libraary
function generateHex() {
    const hexColor = chroma.random();
    return hexColor;
}

// Adding the Hex Codes to generate Random Colours
function randomColors() {
    colorDivs.forEach((div) => {
        const hexText = div.children[0];
        const randomColor = generateHex();

        //Adding the Colour as the background
        div.style.backgroundColor = randomColor;
        const randomColorUpperCase = randomColor;
        hexText.innerText = randomColorUpperCase;

        //Check for contrast
        checkTextContrast(randomColor, hexText);

        //Initialize Colorise Sliders
        const color = chroma(randomColor);
        const sliders = div.querySelectorAll(".sliders input");
        const hue = sliders[0];
        const brightness = sliders[1];
        const saturation = sliders[2];

        colorizeSliders(color, hue, brightness, saturation); 
        // console.log(sliders);
    })
}

function checkTextContrast(color,text) {
    const luminance = chroma(color).luminance();
    if (luminance > 0.5) {
        text.style.color = "black";
    } else {
        text.style.color = "white";
    }
}

function colorizeSliders(color, hue, brightness, saturation) {
    //Scale Saturation
    const noSat = color.set("hsl.s", 0);
    const fullSat = color.set("hsl.s", 1);
    const scaleSat = chroma.scale([noSat, color, fullSat]);
    // Scale Brightness
    const midBright = color.set("hsl.l", 0.5);
    const scaleBright = chroma.scale(["black", midBright, "white"]);
    // Sale Hue
    
    // Updating Input Colors
    saturation.style.backgroundImage = `linear-gradient(to right,${scaleSat(0)},${scaleSat(1)})`;
    brightness.style.backgroundImage = `linear-gradient(to right,${scaleBright(0)},${scaleBright(1)}, ${scaleBright(2)})`;
    hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75), rgb(204,204,75), rgb(75,204,75), rgb(75,204,204), rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))`
}

randomColors();