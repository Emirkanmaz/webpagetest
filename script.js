import { client } from "./@gradio/client/dist/index.js";

let imageData;

async function run(event) {
  event.preventDefault();

  const link = document.getElementById('link').value;
  const prompt = document.getElementById('prompt').value;

  document.getElementById('runButton').style.display = 'none';
  document.getElementById('loadingIndicator').style.display = 'block';

  try {
    const app = await client("https://reach-vb-qr-code-ai-art-generator.hf.space/");
    const result = await app.predict(0, [link, prompt, "ugly, disfigured, low quality, blurry, nsfw", 8.5, 1.3, 1, -1, null, null, true, "DPM++ Karras SDE"]);

    imageData = result?.data;

    if (imageData) {
      displayImage(imageData);
      createDownloadButton();
    } else {
      console.error("Base64 data not found in the result.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    document.getElementById('runButton').style.display = 'block';
    document.getElementById('loadingIndicator').style.display = 'none';
  }
}

function displayImage(base64Data) {
  const imgElement = document.createElement("img");
  imgElement.src = `${base64Data}`;
  imgElement.style.maxWidth = '100%'; // Ensure the image is responsive
  document.getElementById("imageContainer").innerHTML = "";
  document.getElementById("imageContainer").appendChild(imgElement);
}

function createDownloadButton() {

  const existingDownloadButton = document.getElementById("downloadButton");
  if (existingDownloadButton) {
    existingDownloadButton.parentNode.removeChild(existingDownloadButton); // Mevcut düğmeyi kaldır
  }

  const downloadButton = document.createElement("button");
  downloadButton.type = "button";
  downloadButton.id = "downloadButton";
  downloadButton.textContent = "Download Image";
  downloadButton.onclick = downloadImage;
  downloadButton.style.display = 'block';
  downloadButton.style.margin = '0 auto';

  document.getElementById("inputForm").appendChild(downloadButton);
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

document.getElementById('inputForm').addEventListener('submit', run);



