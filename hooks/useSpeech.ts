import { useEffect, useState } from "react";

const useSpeech = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://code.responsivevoice.org/responsivevoice.js?key=1kN4BC0L";
    script.async = true;
    script.onload = () => setIsReady(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const speak = (text: string) => {
    if (isReady && window.responsiveVoice) {
      window.responsiveVoice.speak(text, "Indonesian Female");
    } else {
      console.warn("ResponsiveVoice is not loaded yet.");
    }
  };

  return { speak, isReady };
};

export default useSpeech;
