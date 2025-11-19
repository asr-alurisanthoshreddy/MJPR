
export enum AppView {
  DASHBOARD = 'DASHBOARD', // This is now the Inference Tool interface
  TRAINING = 'TRAINING',
}

export interface TrainingMetric {
  epoch: number;
  loss: number;
  accuracy: number;
  val_loss: number;
  val_accuracy: number;
}

export interface InferenceResult {
  className: string;
  confidence: number;
  heatmapIntensity: number;
  fullReport: string;
}

export interface LayerNode {
  id: string;
  name: string;
  type: '3d' | 'projection' | '2d' | 'dense';
  details: string;
}
