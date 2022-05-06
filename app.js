// Global Variables and selections
const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll("input[type=range]");
const currentHexes = document.querySelectorAll(".color h2");
const popup = document.querySelector(".copy-container");
const adjustButton = document.querySelectorAll(".adjust");
const lockButton = document.querySelectorAll(".lock");
const closedAdjustments = document.querySelectorAll(".close-adjustment");
const sliderContainers = document.querySelectorAll(".sliders");

//Event Listeners
generateBtn.addEventListener("click", randomColors);

sliders.forEach(slider => {
    slider.addEventListener("input", hslControls);
});

colorDivs.forEach((slider,index) => {
    slider.addEventListener("change", () => {
        updateTextUI(index);
    });
});

currentHexes.forEach(hex => {
    hex.addEventListener("click", () => {
        copyToClipboard(hex);
    });
});

popup.addEventListener("transitionend", () => {
    const popupBox = popup.children[0];
    popup.classList.remove("active");
    popupBox.classList.remove("active");
});

adjustButton.forEach((button,index) => {
    button.addEventListener("click", () => {
        openAdjustmentPanel(index);
    });
});

closedAdjustments.forEach((button,index) => {
    button.addEventListener("click", () => {
        closeAdjustmentPanel(index);
    });
});

lockButton.forEach((button, index) => {
  button.addEventListener("click", event => {
    lockLayer(event, index);
  });
});



// Generating Hex Codes using Chroma Js Libraary
function generateHex() {
    const hexColor = chroma.random();
    return hexColor;
}

// Adding the Hex Codes to generate Random Colours
function randomColors() {
    initialColors = [];
    colorDivs.forEach((div) => {
        const hexText = div.children[0];
        const randomColor = generateHex();

        // Adding the Hex to the initialColours Array
        if (div.classList.contains("locked")){
            initialColors.push(hexText.innerText);
            return;
        } else {
            initialColors.push(randomColor.hex()); 
        }

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
    //Reseting Inputs
    resetInputs();

    //Checking for Buttons Contrast
    adjustButton.forEach((button, index) => {
        checkTextContrast(initialColors[index], button);
        checkTextContrast(initialColors[index], lockButton[index]);
    });
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
    hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75), rgb(204,204,75), rgb(75,204,75), rgb(75,204,204), rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))`;
}

function hslControls(event) {
    const index = 
    event.target.getAttribute("data-hue")||
    event.target.getAttribute("data-bright")||
    event.target.getAttribute("data-saturation");

    let sliders = event.target.parentElement.querySelectorAll("input[type=range]");
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];

    const bgColor = initialColors[index];

    let color = chroma(bgColor)
        .set("hsl.s", saturation.value)
        .set("hsl.l", brightness.value)
        .set("hsl.h", hue.value);

    colorDivs[index].style.backgroundColor = color;
    colorizeSliders(color,hue,brightness,saturation);
}

function updateTextUI(index) {
    const activeDiv = colorDivs[index];
    const color = chroma(activeDiv.style.backgroundColor);
    const textHex = activeDiv.querySelector("h2");
    const icons = activeDiv.querySelectorAll(".controls button");
    textHex.innerText = color.hex();
    // Check contrast
    checkTextContrast(color,textHex);
    for (icon of icons) {
        checkTextContrast(color, icon);
    }
}

function resetInputs() {
    const sliders = document.querySelectorAll(".sliders input");
    sliders.forEach(slider => {
        if(slider.name === "hue") {
            const hueColor = initialColors[slider.getAttribute("data-hue")];
            const hueValue = chroma(hueColor).hsl()[0];
            slider.value = Math.floor(hueValue);
        }

        if(slider.name === "brightness") {
            const brightnessColor = initialColors[slider.getAttribute("data-bright")];
            const brightnessValue = chroma(brightnessColor).hsl()[2];
            slider.value = Math.floor(brightnessValue * 100) / 100;
        }

        if(slider.name === "saturation") {
            const saturationColor = initialColors[slider.getAttribute("data-saturation")];
            const saturationValue = chroma(saturationColor).hsl()[1];
            slider.value = Math.floor(saturationValue * 100) / 100;
        }
    })
}

function copyToClipboard(hex) {

    // //Copying to Clipboard
    const copyElement = document.createElement("textarea");
    copyElement.value = hex.innerText;
    document.body.appendChild(copyElement);
    copyElement.select();
    document.execCommand("copy");
    document.body.removeChild(copyElement); 

    // Pop up animation
    const popupBox = popup.children[0];
    popup.classList.add("active");
    popupBox.classList.add("active");
}


function openAdjustmentPanel(index) {
    sliderContainers[index].classList.toggle("active");
}

function closeAdjustmentPanel(index) {
    sliderContainers[index].classList.remove("active");
}

function lockLayer(event, index) {
    const lockSVG = event.target.children[0];
    const activeBg = colorDivs[index];
    activeBg.classList.toggle("locked");

    if (lockSVG.classList.contains("fa-lock-open")) {
            event.target.innerHTML = '<i class="fas fa-lock"></i>';
    } else {
            event.target.innerHTML = '<i class="fas fa-lock-open"></i>';
    }
}

randomColors();