import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function generateId(prefix: string, length = 21) {
    const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    const str = Array(length - prefix.length)
        .fill(0)
        .map(() => chars[Math.floor(Math.random() * chars.length)])
        .join('');
    return `${prefix}${str}`;
}

// Int16Array 转 base64
export function int16ArrayToBase64(int16Array: Int16Array): string {
    const buffer = new ArrayBuffer(int16Array.length * 2); // 2 bytes per Int16
    const view = new DataView(buffer);
    int16Array.forEach((value, index) => {
        view.setInt16(index * 2, value, true); // true for little-endian
    });
    const bytes = new Uint8Array(buffer);
    let binary = '';
    bytes.forEach(byte => binary += String.fromCharCode(byte));
    return btoa(binary);
}

// base64 转 Int16Array
export function base64ToInt16Array(base64: string): Int16Array {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    binary.split('').forEach((char, i) => bytes[i] = char.charCodeAt(0));
    return new Int16Array(bytes.buffer);
}

// 将 Int16Array 转换为 WAV 格式的 Buffer
export function int16ArrayToWavBuffer(int16Array: Int16Array, sampleRate = 16000): Buffer {
    const buffer = new ArrayBuffer(44 + int16Array.length * 2);
    const view = new DataView(buffer);

    // WAV Header
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + int16Array.length * 2, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, int16Array.length * 2, true);

    // Write audio data
    int16Array.forEach((sample, index) => {
        view.setInt16(44 + index * 2, sample, true);
    });

    return Buffer.from(buffer);
}

function writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}