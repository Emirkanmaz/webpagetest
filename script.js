import { client } from "./@gradio/client/dist/index.js";

async function run() {
    const app = await client("https://reach-vb-qr-code-ai-art-generator.hf.space/");
    const result = await app.predict(0, [
        "https://www.linkedin.com/in/emirkanmaz/",
        "dream island",
        "ugly, disfigured, low quality, blurry, nsfw",
        8.5,
        1.3,
        1,
        -1,
        null,
        null,
        true,
        "DPM++ Karras SDE",
    ]);

    const imageData = result?.data;

    if (imageData) {
        // Eğer base64 verisi varsa, bunu bir resme dönüştür ve ekrana göster
        displayImage(imageData);
    } else {
        console.error("Base64 data not found in the result.");
    }
}

function displayImage(base64Data) {
    // Resim elementi oluştur
    const imgElement = document.createElement("img");

    // base64 verisini resim kaynağı olarak kullan
    imgElement.src = `${base64Data}`;

    // Resim elementini container'a ekle
    document.getElementById("imageContainer").innerHTML = "";
    document.getElementById("imageContainer").appendChild(imgElement);
}

document.getElementById('runButton').addEventListener('click', run);
