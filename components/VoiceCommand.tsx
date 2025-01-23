"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import AudioVisualizer from "./AudioVisualizer";

const AnimatedMic = () => (
  <div className="relative">
    <Mic className="w-6 h-6" />
    <div className="absolute inset-0 rounded-full animate-ping bg-blue-400 opacity-75"></div>
  </div>
);

export default function VoiceCommand() {
  const [isListening, setIsListening] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const startListening = useCallback(() => {
    setIsListening(true);
    setText("");
    setError(null);

    // Check if browser supports speech recognition
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      setError("Your browser does not support speech recognition.");
      setIsListening(false);
      return;
    }

    // Initialize speech recognition
    const SpeechRecognition =
      window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "id-ID";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");

      setText(transcript);
    };

    recognition.onerror = (event) => {
      setError(`Error occurred in recognition: ${event.error}`);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();

    return () => {
      recognition.stop();
    };
  }, []);

  const stopListening = useCallback(() => {
    setIsListening(false);
  }, []);

  useEffect(() => {
    return () => {
      if (isListening) {
        stopListening();
      }
    };
  }, [isListening, stopListening]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-xl rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Voice Command</h2>
        <div className="flex justify-center mb-4">
          <Button
            onClick={isListening ? stopListening : startListening}
            className={`${
              isListening
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center`}
          >
            {isListening ? <AnimatedMic /> : <Mic className="w-6 h-6" />}
            <span className="ml-2">
              {isListening ? "Stop Listening" : "Start Listening"}
            </span>
          </Button>
        </div>
        <AudioVisualizer isListening={isListening} />
        <div
          className={`bg-gray-100 rounded-lg p-4 min-h-[100px] mb-4 transition-all duration-300 ${
            isListening ? "border-2 border-blue-500 shadow-lg" : ""
          }`}
        >
          <p className="text-gray-700">
            {text || "Transcribed text will appear here..."}
          </p>
        </div>
        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
            role="alert"
          >
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
