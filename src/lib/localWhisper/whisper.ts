import * as ort from 'onnxruntime-web';

// 定义支持的语言类型
export type WhisperLanguage = 'en' | 'zh' | 'ja' | 'ko' | 'fr' | 'de' | 'es' | 'ru';

// 语言到token的映射
const LANGUAGE_TOKEN_IDS: Record<WhisperLanguage, number> = {
    'en': 50259, // English
    'zh': 50260, // Chinese
    'ja': 50261, // Japanese
    'ko': 50262, // Korean
    'fr': 50265, // French
    'de': 50266, // German
    'es': 50267, // Spanish
    'ru': 50273, // Russian
};

export class Whisper {
    private sess: ort.InferenceSession | null = null;
    private language: WhisperLanguage = 'en';

    constructor(language: WhisperLanguage = 'en') {
        ort.env.logLevel = "error";
        this.language = language;
    }

    setLanguage(language: WhisperLanguage) {
        this.language = language;
    }

    async init() {
        try {
            const opt: ort.InferenceSession.SessionOptions = {
                executionProviders: ["wasm"],
                logSeverityLevel: 3,
                logVerbosityLevel: 3,
            };
            this.sess = await ort.InferenceSession.create("/whisper_small_int8_cpu_ort_1.18.0.onnx", opt);
            console.log('Whisper模型加载成功');
        } catch (error) {
            console.error('Whisper模型加载失败:', error);
            throw error;
        }
    }

    async transcribe(audioData: Int16Array): Promise<string> {
        if (!this.sess) {
            throw new Error('Whisper session not initialized');
        }

        // 将Int16Array转换为Float32Array并进行归一化
        const floatData = Float32Array.from(audioData, x => x / 32768.0);
        const maxAbs = floatData.reduce((max, val) => Math.max(max, Math.abs(val)), 0);
        
        if (maxAbs > 0 && maxAbs < 0.9) {
            const scale = 0.9 / maxAbs;
            floatData.forEach((val, i) => floatData[i] = val * scale);
        }

        // 获取当前语言的token ID
        const languageTokenId = LANGUAGE_TOKEN_IDS[this.language];

        // decoder_input_ids: [start_token, language_token, task_token]
        // 50258: start token
        // languageTokenId: 语言token
        // 50359: transcribe task token (或 50358: translate task token)
        const decoderInputIds = Int32Array.from([50258, languageTokenId, 50359]);

        const feed = {
            "audio_pcm": new ort.Tensor(floatData, [1, floatData.length]),
            "decoder_input_ids": new ort.Tensor(decoderInputIds, [1, 3]),
            "max_length": new ort.Tensor(Int32Array.from([448]), [1]),
            "min_length": new ort.Tensor(Int32Array.from([1]), [1]),
            "num_beams": new ort.Tensor(Int32Array.from([1]), [1]),
            "num_return_sequences": new ort.Tensor(Int32Array.from([1]), [1]),
            "length_penalty": new ort.Tensor(Float32Array.from([1.0]), [1]),
            "repetition_penalty": new ort.Tensor(Float32Array.from([1.0]), [1]),
            "logits_processor": new ort.Tensor(Int32Array.from([0]), [1])
        };

        try {
            const result = await this.sess.run(feed);
            return result.str.data[0] as string;
        } catch (error) {
            console.error('转写失败:', error);
            throw error;
        }
    }
} 