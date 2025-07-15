"use client";
import "@/lib/i18n"; // Make sure this import is at the very top
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  MessageCircle,
  HelpCircle,
  X,
  Flag,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createScript } from "./data/Script";
import { getSentiment } from "./utils/utils";
import Image from "next/image";
import Logo from "../app/img/logo.png";
import useSpeech from "@/hooks/useSpeech";
import { useTranslation } from "react-i18next";

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
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(true);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { speak, isReady } = useSpeech();
  const { t, i18n } = useTranslation();

  const startConversation = () => {
    const script = createScript(t);
    setMessages([script[0]]);
    speakText(script[0].content as string);
  };

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = i18n.language === "en" ? "en-US" : "id-ID";
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
    const script = createScript(t);
    const currentScript = script[assistanceSequence];
    let currentScore = resultDepresion;
    let nextSequence = assistanceSequence;

    if (currentScript.keywords) {
      // Get the sentiment of the user's message
      const sentiment = getSentiment(
        trimmedInputText,
        currentScript.keywords,
        i18n.language
      );

      // Store the user's responses and sentiment in the state
      const newResponses = [
        ...userResponses,
        {
          content: trimmedInputText,
          sentiment,
          questionSeq: assistanceSequence,
        },
      ];
      if (currentScript.reverse) {
        if (sentiment.score > 0) currentScore++;
      } else {
        if (sentiment.score < 0) currentScore++;
      }
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
    if (script.length !== nextSequence) {
      setAssistanceSequence(nextSequence);
      setMessages((prevMessages) => [...prevMessages, script[nextSequence]]);
      // Speak the next question
      speakText(
        typeof script[nextSequence].content === "string"
          ? script[nextSequence].content
          : script[nextSequence].content(currentScore)
      );
    }
  };

  const speakText = (text: string) => {
    if (synthRef.current) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text.replace("<br>", "."));
      utterance.onend = () => setIsSpeaking(false);

      // Try to find Indonesian voice
      const voices = synthRef.current.getVoices();
      const indonesianVoice = voices.find((voice) =>
        voice.lang.includes(i18n.language === "en" ? "en-US" : "id-ID")
      );

      if (indonesianVoice) {
        utterance.lang = i18n.language === "en" ? "en-US" : "id-ID";
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
              {t("description")}
            </p>
          </div>
          <div className="flex flex-col gap-4 mt-10">
            <Button
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-7 text-xl font-semibold rounded-xl transform transition-all hover:scale-105 shadow-lg hover:shadow-xl"
              onClick={startConversation}
            >
              <MessageCircle className="mr-3 h-16 w-16 animate-pulse" />
              {t("start_conversation")}
            </Button>
            <Button
              className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-6 py-7 text-xl font-semibold rounded-xl transform transition-all hover:scale-105 shadow-lg hover:shadow-xl"
              onClick={() => setShowHelpModal(true)}
            >
              <HelpCircle className="mr-2 h-8 w-8" />
              {t("how_to_use")}
            </Button>
          </div>
        </div>
      )}
      {messages.length > 0 && (
        <>
          <div className="flex justify-end p-2 bg-white border-b">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-blue-600"
              onClick={() => setShowHelpModal(true)}
            >
              <HelpCircle className="h-5 w-5 mr-1" />
              Bantuan
            </Button>
          </div>
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSend();
                  }
                }}
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

      {/* Language Selection Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold text-blue-600">
                {t("Pilih Bahasa")}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLanguageModal(false)}
                className="rounded-full h-8 w-8 p-0"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <button
                  className={`w-full py-2 px-4 rounded-md border text-left ${
                    i18n.language === "id"
                      ? "bg-blue-100 border-blue-500"
                      : "border-neutral-200"
                  }`}
                  onClick={() => {
                    i18n.changeLanguage("id");
                    setShowLanguageModal(false);
                  }}
                >
                  🇮🇩 Bahasa Indonesia
                </button>
                <button
                  className={`w-full py-2 px-4 rounded-md border text-left ${
                    i18n.language === "en"
                      ? "bg-blue-100 border-blue-500"
                      : "border-neutral-200"
                  }`}
                  onClick={() => {
                    i18n.changeLanguage("en");
                    setShowLanguageModal(false);
                  }}
                >
                  🇬🇧 English
                </button>
                {/* Add more languages here if needed */}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Button to open language modal */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          variant="outline"
          className="bg-white border-blue-500 text-blue-700 hover:bg-blue-50"
          onClick={() => setShowLanguageModal(true)}
        >
          <MessageCircle className="mr-2" />
          {t("Ganti Bahasa")}
        </Button>
      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold text-blue-600">
                {t("how_to_use")}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHelpModal(false)}
                className="rounded-full h-8 w-8 p-0"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg text-blue-700">
                  {t("how_to_use_title")}
                </h3>
                <p className="text-gray-700">{t("how_to_use_description")}</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-lg text-blue-700">
                  {t("how_to_use_feature_sound")}
                </h3>
                <div className="flex items-center space-x-2 mb-2">
                  <Mic className="text-blue-500" />
                  <p className="text-gray-700">
                    {t("how_to_use_feature_sound_on")}
                  </p>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <MicOff className="text-red-500" />
                  <p className="text-gray-700">
                    {t("how_to_use_feature_sound_off")}
                  </p>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <Volume2 className="text-purple-500" />
                  <p className="text-gray-700">
                    {t("how_to_use_feature_sound_listen_on")}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <VolumeX className="text-red-500" />
                  <p className="text-gray-700">
                    {t("how_to_use_feature_sound_listen_off")}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-lg text-blue-700">
                  {t("how_to_use_feature_chat")}
                </h3>
                <div className="flex items-center space-x-2">
                  <Send className="text-green-500" />
                  <p className="text-gray-700">
                    {t("how_to_use_feature_chat_send")}
                  </p>
                </div>
                <p className="text-gray-700 mt-2">
                  {t("how_to_use_feature_chat_description")}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-lg text-blue-700">
                  {t("how_to_use_tips")}
                </h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  <li>{t("how_to_use_tips_1")}</li>
                  <li>{t("how_to_use_tips_2")}</li>
                  <li>{t("how_to_use_tips_3")}</li>
                  <li>{t("how_to_use_tips_4")}</li>
                </ul>
              </div>
            </div>
            <div className="p-4 border-t bg-gray-50">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setShowHelpModal(false)}
              >
                {t("button_understand")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
