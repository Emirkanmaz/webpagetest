import { client } from "./@gradio/client/dist/index.js";

let imageData;
let loadingInterval;
let loadingTimeout;
let intervalCleared = false;


async function run(event) {
  event.preventDefault();

  const link = document.getElementById('link').value;
  const prompt = document.getElementById('prompt').value;
  const negativePrompt = document.getElementById('negativePrompt').value;
  const guidanceScale = parseFloat(document.getElementById('guidanceScale').value);
  const qrWeightFactor = parseFloat(document.getElementById('qrWeightFactor').value);
  const qrPrecision = parseFloat(document.getElementById('qrPrecision').value);
  const qrSeed = parseInt(document.getElementById('qrSeed').value);
  

  document.getElementById('runButton').style.display = 'none';
  const loadingIndicator = document.getElementById('loadingIndicator');
  loadingIndicator.style.display = 'block';
  
  
  let dots = 0;
  loadingInterval = setInterval(() => {
    dots = (dots + 1) % 4;
    loadingIndicator.textContent = 'Dreaming' + '.'.repeat(dots);
  }, 500);

  loadingTimeout = setTimeout(showLoadingWarning, 30000);

  try {
    const app = await client("https://reach-vb-qr-code-ai-art-generator.hf.space/");
    const result = await app.predict(0, [
      link, 
      prompt, 
      negativePrompt, 
      guidanceScale, 
      qrWeightFactor, 
      qrPrecision, 
      qrSeed,
      null, null, true, "DPM++ Karras SDE"
    ]);
    if (result && result.data && result.data[0]) {
      imageData = result.data[0];
      displayImage(imageData);
      createDownloadButton();
    } else {
      console.error("Image data not found in the result.");
      alert("Failed to generate image. Please try again.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
    alert("An error occurred while generating the image. Please try again.");
  } finally {
    if (!intervalCleared) {
      clearInterval(loadingInterval);
    }
    clearTimeout(loadingTimeout);
    document.getElementById('runButton').style.display = 'block';
    loadingIndicator.style.display = 'none';
  }
}

function showLoadingWarning() {
  if (!intervalCleared) {
    clearInterval(loadingInterval);
    intervalCleared = true;
  }
  const loadingIndicator = document.getElementById('loadingIndicator');
  loadingIndicator.textContent = "Takes more than 30 seconds? This is because the server is sleeping. Try again in 5 minutes or wait. Working on it :)";
}

function displayImage(base64Data) {
  const imgElement = document.createElement("img");
  imgElement.src = `${base64Data}`;
  imgElement.style.maxWidth = '100%';
  document.getElementById("imageContainer").innerHTML = "";
  document.getElementById("imageContainer").appendChild(imgElement);
}

function createDownloadButton() {

  const existingDownloadButton = document.getElementById("downloadButton");
  if (existingDownloadButton) {
    existingDownloadButton.parentNode.removeChild(existingDownloadButton);
  }

  const downloadButton = document.createElement("button");
  downloadButton.type = "button";
  downloadButton.id = "downloadButton";
  downloadButton.textContent = "Download Image";
  downloadButton.onclick = downloadImage;

  const buttonContainer = document.createElement("div");
  buttonContainer.className = "button-container";
  buttonContainer.appendChild(downloadButton);

  document.getElementById("inputForm").appendChild(buttonContainer);
}


function downloadImage() {
  const fileURL = `${imageData}`;
  var a = document.createElement("a");
  a.href = fileURL;
  a.download = "QrDream.png";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function updateSliderValue(sliderId, valueId) {
  const slider = document.getElementById(sliderId);
  const valueSpan = document.getElementById(valueId);
  valueSpan.textContent = slider.value;
}

function initializeSliders() {
  const sliders = [
    { sliderId: 'guidanceScale', valueId: 'guidanceScaleValue' },
    { sliderId: 'qrWeightFactor', valueId: 'qrWeightFactorValue' },
    { sliderId: 'qrPrecision', valueId: 'qrPrecisionValue' },
    { sliderId: 'qrSeed', valueId: 'qrSeedValue' }
  ];

  sliders.forEach(({ sliderId, valueId }) => {
    const slider = document.getElementById(sliderId);
    slider.addEventListener('input', () => updateSliderValue(sliderId, valueId));
    updateSliderValue(sliderId, valueId);
  });
}

function generateRandomSeed() {
  return Math.floor(Math.random() * 1000000000);
}

function initializeInputs() {
  const inputs = [
    { sliderId: 'guidanceScale', inputId: 'guidanceScaleInput' },
    { sliderId: 'qrWeightFactor', inputId: 'qrWeightFactorInput' },
    { sliderId: 'qrPrecision', inputId: 'qrPrecisionInput' },
    { sliderId: 'qrSeed', inputId: 'qrSeedInput' }
  ];

  inputs.forEach(({ sliderId, inputId }) => {
    const slider = document.getElementById(sliderId);
    const input = document.getElementById(inputId);

    if (sliderId === 'qrSeed' && slider.value === '-1') {
      const randomSeed = generateRandomSeed();
      slider.value = randomSeed;
      input.value = randomSeed;
    }

    slider.addEventListener('input', () => {
      input.value = slider.value;
    });

    input.addEventListener('input', () => {
      slider.value = input.value;
    });
  });
}

function initializeSeedInput() {
  const seedSlider = document.getElementById('qrSeed');
  const seedInput = document.getElementById('qrSeedInput');

  seedSlider.addEventListener('change', () => {
    if (seedSlider.value === '-1') {
      const randomSeed = generateRandomSeed();
      seedSlider.value = randomSeed;
      seedInput.value = randomSeed;
    }
  });

  seedInput.addEventListener('change', () => {
    if (seedInput.value === '-1') {
      const randomSeed = generateRandomSeed();
      seedSlider.value = randomSeed;
      seedInput.value = randomSeed;
    }
  });
}



document.getElementById('inputForm').addEventListener('submit', run);
document.addEventListener('DOMContentLoaded', initializeSliders);
document.addEventListener('DOMContentLoaded', initializeInputs);
document.addEventListener('DOMContentLoaded', () => {
  initializeInputs();
  initializeSeedInput();
})
