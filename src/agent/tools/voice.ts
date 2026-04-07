export interface VoiceConfig {
  enabled: boolean;
  voice?: string;
  rate: number;
  pitch: number;
  volume: number;
}

export interface SpeechResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export class VoiceModule {
  private synthesis: SpeechSynthesis;
  private recognition: any | null = null;
  private config: VoiceConfig;
  private speaking = false;
  private listening = false;

  constructor(config: Partial<VoiceConfig> = {}) {
    this.synthesis = window.speechSynthesis;
    this.config = {
      enabled: config.enabled ?? true,
      voice: config.voice,
      rate: config.rate ?? 1.0,
      pitch: config.pitch ?? 1.0,
      volume: config.volume ?? 1.0,
    };
    
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window.SpeechRecognition || window.webkitSpeechRecognition);
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
    }
  }

  async speak(text: string, onEnd?: () => void): Promise<void> {
    if (!this.config.enabled || !this.synthesis) return;

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.rate = this.config.rate;
      utterance.pitch = this.config.pitch;
      utterance.volume = this.config.volume;
      
      if (this.config.voice) {
        const voices = this.synthesis.getVoices();
        const selectedVoice = voices.find(v => v.name === this.config.voice);
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      }
      
      utterance.onstart = () => {
        this.speaking = true;
      };
      
      utterance.onend = () => {
        this.speaking = false;
        onEnd?.();
        resolve();
      };
      
      utterance.onerror = (error) => {
        this.speaking = false;
        reject(error);
      };
      
      this.synthesis.speak(utterance);
    });
  }

  async speakAsync(text: string): Promise<void> {
    if (!this.config.enabled) return;
    this.synthesis.speak(new SpeechSynthesisUtterance(text));
  }

  stop(): void {
    this.synthesis.cancel();
    this.speaking = false;
  }

  pause(): void {
    this.synthesis.pause();
  }

  resume(): void {
    this.synthesis.resume();
  }

  getVoices(): SpeechSynthesisVoice[] {
    return this.synthesis.getVoices();
  }

  setVoice(voiceName: string): void {
    this.config.voice = voiceName;
  }

  setRate(rate: number): void {
    this.config.rate = Math.max(0.1, Math.min(10, rate));
  }

  setPitch(pitch: number): void {
    this.config.pitch = Math.max(0, Math.min(2, pitch));
  }

  setVolume(volume: number): void {
    this.config.volume = Math.max(0, Math.min(1, volume));
  }

  startListening(
    onResult: (result: SpeechResult) => void,
    onError?: (error: string) => void
  ): void {
    if (!this.recognition) {
      onError?.('Speech recognition not supported');
      return;
    }

    if (this.listening) {
      this.recognition.stop();
    }

    this.recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript;
      const confidence = result[0].confidence;
      
      onResult({
        transcript,
        confidence,
        isFinal: result.isFinal,
      });

      if (result.isFinal) {
        this.listening = false;
      }
    };

    this.recognition.onerror = (event) => {
      this.listening = false;
      onError?.(event.error);
    };

    this.recognition.onend = () => {
      this.listening = false;
    };

    this.recognition.start();
    this.listening = true;
  }

  stopListening(): void {
    if (this.recognition && this.listening) {
      this.recognition.stop();
      this.listening = false;
    }
  }

  isSpeaking(): boolean {
    return this.speaking;
  }

  isListening(): boolean {
    return this.listening;
  }

  getConfig(): VoiceConfig {
    return { ...this.config };
  }
}

let voiceModuleInstance: VoiceModule | null = null;

export function getVoiceModule(config?: Partial<VoiceConfig>): VoiceModule {
  if (!voiceModuleInstance) {
    voiceModuleInstance = new VoiceModule(config);
  }
  return voiceModuleInstance;
}
