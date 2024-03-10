import { client } from "./@gradio/client/dist/index.js";

let imageData;

async function run(event) {
  event.preventDefault();

  const linkedin = document.getElementById('linkedin').value;
  const dream = document.getElementById('dream').value;
  const tags = document.getElementById('tags').value;

  document.getElementById('runButton').style.display = 'none';
  document.getElementById('loadingIndicator').style.display = 'block';

  try {
    const app = await client("https://reach-vb-qr-code-ai-art-generator.hf.space/");
    const result = await app.predict(0, [linkedin, dream, tags, 7.5, 1.1, 0.9, -1, null, null, true, "DPM++ Karras SDE"]);

    imageData = result?.data;

    if (imageData) {
      displayImage(imageData);
      document.getElementById("downloadButton").remove();
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
  document.getElementById("imageContainer").innerHTML = "";
  document.getElementById("imageContainer").appendChild(imgElement);
}

function createDownloadButton() {
  // "Resmi İndir" butonunu yarat
  const downloadButton = document.createElement("button");
  downloadButton.type = "button";
  downloadButton.id = "downloadButton";
  downloadButton.style.display = "block";
  downloadButton.textContent = "Resmi İndir";
  downloadButton.onclick = downloadImage;

  // "Resmi İndir" butonunu sayfaya ekle
  document.body.appendChild(downloadButton);
}

function downloadImage() {
  const fileURL = `${imageData}`;
  var a = document.createElement("a");
  a.href = fileURL;
  a.download = "indirilecek_resim.png";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a); // "Resmi İndir" butonundan bağlantıyı kaldır
}

document.getElementById('inputForm').addEventListener('submit', run);
