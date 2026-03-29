'use client';

import { useState, useEffect, useCallback } from 'react';
import { VoiceModule, VoiceConfig, SpeechResult } from './voice';

export function useVoice(config?: Partial<VoiceConfig>) {
  const [voiceModule, setVoiceModule] = useState<VoiceModule | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const module = new VoiceModule(config);
      setVoiceModule(module);
      
      const loadVoices = () => {
        const availableVoices = module.getVoices();
        setVoices(availableVoices);
        setIsReady(true);
      };
      
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
      
      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, []);

  const speak = useCallback(async (text: string) => {
    if (voiceModule) {
      setIsSpeaking(true);
      try {
        await voiceModule.speak(text, () => setIsSpeaking(false));
      } catch {
        setIsSpeaking(false);
      }
    }
  }, [voiceModule]);

  const speakAsync = useCallback((text: string) => {
    if (voiceModule) {
      voiceModule.speakAsync(text);
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 100);
    }
  }, [voiceModule]);

  const stop = useCallback(() => {
    voiceModule?.stop();
    setIsSpeaking(false);
  }, [voiceModule]);

  const startListening = useCallback((
    onResult: (result: SpeechResult) => void,
    onError?: (error: string) => void
  ) => {
    if (voiceModule) {
      voiceModule.startListening(onResult, onError);
      setIsListening(true);
    }
  }, [voiceModule]);

  const stopListening = useCallback(() => {
    voiceModule?.stopListening();
    setIsListening(false);
  }, [voiceModule]);

  return {
    speak,
    speakAsync,
    stop,
    startListening,
    stopListening,
    voices,
    isReady,
    isSpeaking,
    isListening,
    setVoice: (name: string) => voiceModule?.setVoice(name),
    setRate: (rate: number) => voiceModule?.setRate(rate),
    setPitch: (pitch: number) => voiceModule?.setPitch(pitch),
    setVolume: (volume: number) => voiceModule?.setVolume(volume),
  };
}
