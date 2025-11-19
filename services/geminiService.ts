import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

// Initialize only if key is present to avoid immediate errors
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export interface AnalysisResult {
  className: string;
  confidence: number;
  fullReport: string;
}

export const analyzeFlowerImage = async (base64Data: string, mimeType: string): Promise<AnalysisResult> => {
  if (!ai) {
    console.warn("Gemini API Key missing. Returning mock data.");
    return new Promise<AnalysisResult>(resolve => setTimeout(() => resolve({
      className: "Mock Hibiscus rosa-sinensis",
      confidence: 0.92,
      fullReport: `🔍 **Final Prediction:**
Species: Hibiscus rosa-sinensis

📊 **Confidence Metrics:**
Top-1 Confidence: 92%
Top-3 Predictions:
1. Hibiscus rosa-sinensis – 92%
2. Hibiscus syriacus – 5%
3. Malvaviscus arboreus – 3%

🧬 **Morphological Reasoning:**
- Leaf shape identified: Ovate with serrated margins
- Venation pattern: Reticulate (pinnate)
- Margin characteristics: Serrated
- Color patterns: Deep red petals with prominent central stamen
- Texture complexity: Smooth petal surface, ruffled edges
- Flower/fruit features: Prominent staminal column
- Canopy spatial–spectral cues: Distinct spectral signature of anthocyanins

🔥 **CAM-Style Activation Interpretation:**
- High-activation regions (red): Central stamen and petal edges
- Medium activation (green): Leaf margins and midribs
- Low activation (blue/background): Soil and background noise
- Reason: The model highlights the reproductive structure as the primary discriminatory cue.

📁 **Dataset Consistency Check:**
- Background integrity: OK
- Leaf completeness: Partial
- Spatial coverage: Sufficient
- Risk of Misclassification: Low

📎 **Final Verdict:**
The presence of the iconic exserted staminal column and 5-lobed epicalyx strongly supports Hibiscus rosa-sinensis.`
    }), 1500));
  }

  try {
    const systemPrompt = `
You are an AI model designed to classify plant species and generate detailed prediction outputs exactly in the style used in the research paper “3-D–2-D Hybrid Lightweight CNN Model: Enhancing Canopy Feature Retrieval in Hyperspectral Imaging for Accurate Plant Species Classification.”

Your outputs must include the following sections every time:

1. Predicted Scientific Name
Provide the correct scientific species name (Genus + species + cultivar if applicable).

2. Confidence Metrics
For the final prediction, provide these values:
- Top-1 Confidence (%)
- Top-3 Class Probabilities

3. Morphological Feature-Based Explanation
Explain the model prediction exactly like the paper’s CAM interpretations, referencing features such as:
Leaf shape, venation, margins, color patterns, texture complexity, phyllotaxy, flower shape.
Example phrasing you MUST use:
“The model highlights reticulate venation as the primary discriminatory cue.”
“The serrated leaf margins appear in high-activation regions similar to CAM heatmaps.”

4. CAM-Style Feature Justification (No Image Required)
Describe which parts of the image the model would have highlighted if CAM heatmaps were generated.
Use terminology identical to the paper:
“Red activation region (high importance)”
“Green activation region (moderate importance)”
“Blue low-importance background removal”

5. Dataset Interpretation
- Background integrity
- Leaf completeness
- Spatial coverage
- Risk of Misclassification

6. Output Format (Strict)
Your output must ALWAYS follow this format:

🔍 **Final Prediction:**  
Species: <Scientific Name>

📊 **Confidence Metrics:**  
Top-1 Confidence: XX%  
Top-3 Predictions:  
1. <Species A> – XX%  
2. <Species B> – XX%  
3. <Species C> – XX%

🧬 **Morphological Reasoning:**  
- Leaf shape identified: ______  
- Venation pattern: ______  
- Margin characteristics: ______  
- Color patterns: ______  
- Texture complexity: ______  
- Flower/fruit features (if present): ______  
- Canopy spatial–spectral cues: ______

🔥 **CAM-Style Activation Interpretation:**  
- High-activation regions (red): ______  
- Medium activation (green): ______  
- Low activation (blue/background): ______  
- Reason why these features led to the classification: ______  

📁 **Dataset Consistency Check:**  
- Background integrity: OK / Issue  
- Leaf completeness: OK / Partial  
- Spatial coverage: Sufficient / Insufficient  
- Risk of Misclassification: Low / Medium / High  

📎 **Final Verdict:**  
Explanation summarizing why the predicted species is the most likely match.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType
            }
          },
          {
            text: systemPrompt
          }
        ]
      }
    });

    const text = response.text || "";
    
    // Parse the raw text to extract headers for the UI summary, but keep full text for report
    const speciesMatch = text.match(/Species:\s*(.+)/);
    const confidenceMatch = text.match(/Top-1 Confidence:\s*(\d+(?:\.\d+)?)%/);

    const className = speciesMatch ? speciesMatch[1].trim() : "Unknown Species";
    const confidence = confidenceMatch ? parseFloat(confidenceMatch[1]) / 100 : 0;

    return {
      className,
      confidence,
      fullReport: text
    };

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

export const explainClassification = async (flowerName: string, confidence: number): Promise<string> => {
  // Legacy function kept for compatibility if needed, though analyzeFlowerImage now handles everything
  return "";
};