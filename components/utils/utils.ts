export function getSentiment(text: string, keywords: object, language: string) {
  const Sentiment = require("sentiment");
  const sentiment = new Sentiment();
  if (language === "id") {
    const idLanguage = {
      labels: keywords,
    };
    sentiment.registerLanguage("id", idLanguage);
  }

  const result = sentiment.analyze(text, { language: language });

  return result;
}
