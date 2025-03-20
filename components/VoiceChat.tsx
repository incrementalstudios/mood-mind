"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  MessageCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SCRIPT } from "./data/Script";
import { getSentiment } from "./utils/utils";
import Image from "next/image";
import Logo from "../app/img/logo.png";
import useSpeech from "@/hooks/useSpeech";

type Message = {
  role: "user" | "assistant";
  content: string | ((score?: number) => string);
  checkSentiment?: boolean;
  keywords?: object;
  condition?: (score: number, sequence: number) => number;
};

export default function VoiceChat() {
  const [messages, setMessages] = useState<Message[]>([]);
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
  const { speak, isReady } = useSpeech();

  const startConversation = () => {
    setMessages([SCRIPT[0]]);
    speakText(SCRIPT[0].content as string);
  };

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

  /**
   * Handles the send button click event. It processes the user's input message,
   * resets the speech recognition, and sends the message to the server.
   */
  const handleSend = async () => {
    const trimmedInputText = inputText.trim();
    if (!trimmedInputText) return;

    // Display the user's message
    const newMessages = [
      ...messages,
      { role: "user", content: trimmedInputText },
    ];
    setMessages(newMessages);
    setInputText("");

    // Stop the speech recognition
    recognitionRef.current.stop();
    setIsListening(!isListening);

    // Process the user's message to determine the next sequence of questions
    const currentScript = SCRIPT[assistanceSequence];
    let currentScore = resultDepresion;
    let nextSequence = assistanceSequence;

    if (currentScript.keywords) {
      // Get the sentiment of the user's message
      const sentiment = getSentiment(trimmedInputText, currentScript.keywords);
      // Store the user's responses and sentiment in the state
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

    // Check if the next sequence of questions depends on the sentiment score
    if (currentScript.condition) {
      nextSequence = currentScript.condition(currentScore, nextSequence);
    } else {
      nextSequence++;
    }

    // Check if the next sequence of questions is not the end of the script
    if (SCRIPT.length !== nextSequence) {
      setAssistanceSequence(nextSequence);
      setMessages((prevMessages) => [...prevMessages, SCRIPT[nextSequence]]);
      // Speak the next question
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

      // Try to find Indonesian voice
      const voices = synthRef.current.getVoices();
      const indonesianVoice = voices.find((voice) =>
        voice.lang.includes("id-ID")
      );

      if (indonesianVoice) {
        utterance.lang = "id-ID";
        utterance.voice = indonesianVoice;
        synthRef.current.speak(utterance);
      } else {
        if (isReady) speak(text);
      }
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
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-blue-50 to-white animate-fade-in">
          <div className="text-center space-y-6 p-8 bg-white rounded-2xl shadow-xl border border-blue-100">
            <div className="flex justify-center">
              <Image src={Logo} alt="MoodMind Logo" className="w-40 h-40" />
            </div>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
              MoodMind
            </h1>
            <p className="text-gray-600 max-w-md text-lg leading-relaxed animate-slide-up">
              Teman pendamping kesehatan mental pribadi Anda. Mari mulai
              percakapan interaktif untuk mengeksplorasi dan memahami perasaan
              Anda serta mendapatkan dukungan emosional yang Anda butuhkan.
            </p>
          </div>
          <Button
            className="mt-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-7 text-xl font-semibold rounded-xl transform transition-all hover:scale-105 shadow-lg hover:shadow-xl"
            onClick={startConversation}
          >
            <MessageCircle className="mr-3 h-16 w-16 animate-pulse" />
            Mulai Percakapan Interaktif
          </Button>
        </div>
      )}
      {messages.length > 0 && (
        <>
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
                      <p
                        dangerouslySetInnerHTML={{
                          __html: message.content,
                        }}
                      />
                    ) : (
                      <p
                        dangerouslySetInnerHTML={{
                          __html: message.content(resultDepresion),
                        }}
                      />
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
                    : () =>
                        speakText(messages[messages.length - 1]?.content || "")
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
          </div>
        </>
      )}
    </div>
  );
}
