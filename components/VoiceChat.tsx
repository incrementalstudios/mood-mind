"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Send, Volume2, VolumeX } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SCRIPT } from "./data/Script";
import { getSentiment } from "./utils/utils";

type Message = {
  role: "user" | "assistant";
  content: string | ((score?: number) => string);
  checkSentiment?: boolean;
  keywords?: object;
  condition?: (score: number, sequence: number) => number;
};

export default function VoiceChat() {
  const [messages, setMessages] = useState<Message[]>([SCRIPT[0]]);
  const [userResponses, setUserResponses] = useState<any[]>([]);
  const [resultDepresion, setResultDepresion] = useState<number>(0);
  const [assistanceSequence, setAssistanceSequence] = useState<number>(0);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  console.log("userResponses", userResponses);
  console.log("resultDepresion", resultDepresion);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = "id-ID";
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("");

        setInputText(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        setError(`Error occurred in recognition: ${event.error}`);
      };
    } else {
      setError("Your browser does not support speech recognition.");
    }

    synthRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
    setIsListening(!isListening);
  };

  const handleSend = async () => {
    const trimmedInputText = inputText.trim();
    if (!trimmedInputText) return;

    const newMessages = [
      ...messages,
      { role: "user", content: trimmedInputText },
    ];
    setMessages(newMessages);
    setInputText("");

    const currentScript = SCRIPT[assistanceSequence];
    let currentScore = resultDepresion;
    let nextSequence = assistanceSequence;

    if (currentScript.keywords) {
      const sentiment = getSentiment(trimmedInputText, currentScript.keywords);
      const newResponses = [
        ...userResponses,
        {
          content: trimmedInputText,
          sentiment,
          questionSeq: assistanceSequence,
        },
      ];
      if (sentiment.score < 0) currentScore++;
      setUserResponses(newResponses);
      setResultDepresion(currentScore);
    }

    if (currentScript.condition) {
      nextSequence = currentScript.condition(currentScore, nextSequence);
    } else {
      nextSequence++;
    }

    if (SCRIPT.length !== nextSequence) {
      setAssistanceSequence(nextSequence);
      setMessages((prevMessages) => [...prevMessages, SCRIPT[nextSequence]]);
      speakText(
        typeof SCRIPT[nextSequence].content === "string"
          ? SCRIPT[nextSequence].content
          : SCRIPT[nextSequence].content(currentScore)
      );
    }
  };

  const speakText = (text: string) => {
    if (synthRef.current) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      utterance.lang = "id-ID";
      utterance.rate = 1.2;
      synthRef.current.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-gray-100">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex items-start space-x-2 ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <Avatar>
                <AvatarFallback>
                  {message.role === "user" ? "U" : "AI"}
                </AvatarFallback>
                <AvatarImage
                  src={
                    message.role === "user"
                      ? "/user-avatar.png"
                      : "/ai-avatar.png"
                  }
                />
              </Avatar>
              <div
                className={`p-3 rounded-lg ${
                  message.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-white"
                }`}
              >
                {typeof message.content === "string" ? (
                  <p>{message.content}</p>
                ) : (
                  message.content(resultDepresion)
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white border-t">
        <div className="flex items-center space-x-2">
          <Button
            onClick={toggleListening}
            className={`${
              isListening
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
          >
            {isListening ? <MicOff /> : <Mic />}
          </Button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 p-2 border border-neutral-200 rounded-md dark:border-neutral-800"
            placeholder="Type or speak your message..."
          />
          <Button
            onClick={handleSend}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            <Send />
          </Button>
          <Button
            onClick={
              isSpeaking
                ? stopSpeaking
                : () => speakText(messages[messages.length - 1]?.content || "")
            }
            className={`${
              isSpeaking
                ? "bg-red-500 hover:bg-red-600"
                : "bg-purple-500 hover:bg-purple-600"
            } text-white`}
            disabled={messages.length === 0}
          >
            {isSpeaking ? <VolumeX /> : <Volume2 />}
          </Button>
        </div>
        {error && (
          <div className="mt-2 text-red-500" role="alert">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
