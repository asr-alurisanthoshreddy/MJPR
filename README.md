
# HSSAN: Hybrid-LtCNN Studio

This is the frontend dashboard for the "Existing System 2" (Hybrid Lightweight CNN) Hyperspectral Flower Classification project. It allows for live image analysis and training monitoring.

## 🚀 Prerequisites

1.  **Node.js**: Version 18 or higher.
2.  **Python 3.8+**: (Optional) If you plan to run the backend training scripts.
3.  **Gemini API Key**: Required for the AI analysis features.

## 🛠️ Installation & Setup (VS Code)

1.  **Clone or Download the project**.
2.  **Open the folder in VS Code**.
3.  **Create the Environment File**:
    *   Create a new file named `.env` in the root directory.
    *   Add your API Key:
        ```env
        API_KEY=your_actual_api_key_here
        ```
4.  **Install Dependencies**:
    Open the VS Code terminal (`Ctrl+` `) and run:
    ```bash
    npm install
    ```

## ▶️ Running the App

Start the local development server:
```bash
npm start
```
The app will open at `http://localhost:3000` (or similar).

## 🧠 Project Structure

*   **Dashboard (Inference)**: Upload flower images to get detailed morphological classification reports.
*   **Training**: Paste your Python training configuration or API endpoint to monitor training metrics in real-time.

## 📦 Python Backend Requirements

If you are setting up the actual PyTorch model training environment (the backend for this dashboard), install these dependencies:

```text
# See requirements.txt for full list
torch>=1.13.0
torchvision>=0.14.0
numpy>=1.21.0
scipy>=1.7.0
scikit-learn>=1.0.0
matplotlib>=3.5.0
tqdm>=4.64.0
spectral>=0.22.0
onnx>=1.12.0
onnxruntime>=1.13.0
```
