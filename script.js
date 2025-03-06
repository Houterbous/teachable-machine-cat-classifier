// Define the URL to your Teachable Machine model
const URL = "https://teachablemachine.withgoogle.com/models/Wj3dFXubB/"; // Укажите свой URL

let model, maxPredictions;

// Load the model and metadata
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    try {
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        console.log("Model loaded successfully.");
    } catch (error) {
        console.error("Error loading model:", error);
    }
}

// Function to handle the file upload event
function handleFileUpload(event) {
    const file = event.target.files[0]; // Get the uploaded file
    if (file) {
        const img = document.createElement("img");
        img.src = window.URL.createObjectURL(file);
        img.classList.add("uploaded-image");

        img.onload = () => {
            document.getElementById("image-container").innerHTML = ''; // Clear any existing image
            document.getElementById("image-container").appendChild(img); // Display the uploaded image
            predict(img); // Call the predict function after image loads
        };

        img.onerror = () => {
            console.error("Error loading image.");
        };
    }
}

// Function to make predictions based on the uploaded image
async function predict(imgElement) {
    if (!model) {
        document.getElementById("label-container").innerText = "Модель еще загружается...";
        return;
    }

    try {
        const predictions = await model.predict(imgElement);
        const labelContainer = document.getElementById("label-container");
        labelContainer.innerHTML = ''; // Clear previous predictions

        // Display predictions in the label container
        for (let i = 0; i < maxPredictions; i++) {
            const classPrediction = predictions[i].className + ": " + (predictions[i].probability * 100).toFixed(2) + "%";
            const div = document.createElement("div");
            div.textContent = classPrediction;
            labelContainer.appendChild(div);
        }
    } catch (error) {
        console.error("Error making predictions:", error);
    }
}

// Initialize the model when the page loads
window.onload = init;
