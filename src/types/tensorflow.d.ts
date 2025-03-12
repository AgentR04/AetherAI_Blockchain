declare module '@tensorflow/tfjs-node' {
    export * from '@tensorflow/tfjs';
}

declare module '@tensorflow/tfjs' {
    export interface LayersModel {
        predict(inputs: Tensor | Tensor[]): Tensor | Tensor[];
    }

    export interface Tensor {
        dataSync(): number[];
        data(): Promise<number[]>;
        dispose(): void;
    }

    export function tensor(values: number[], shape?: number[]): Tensor;
    export function tensor2d(values: number[][], shape?: [number, number]): Tensor;
    export function sequential(): Sequential;

    export interface Sequential {
        add(layer: Layer): void;
        compile(config: CompileConfig): void;
        fit(x: Tensor, y: Tensor, config?: FitConfig): Promise<void>;
        predict(inputs: Tensor): Tensor;
    }

    export interface Layer {
        units?: number;
        activation?: string;
        inputShape?: number[];
        rate?: number;
    }

    export interface CompileConfig {
        optimizer: string;
        loss: string;
        metrics?: string[];
    }

    export interface FitConfig {
        epochs?: number;
        batchSize?: number;
        validationSplit?: number;
    }

    export const layers: {
        dense(config: Layer): Layer;
        dropout(config: Layer): Layer;
    };

    export const train: {
        adam(learningRate?: number): any;
    };
}
