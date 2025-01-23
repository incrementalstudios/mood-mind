export function getSentiment(text: string, keywords: object) {
  const Sentiment = require("sentiment");
  const sentiment = new Sentiment();
  const idLanguage = {
    labels: keywords,
  };
  sentiment.registerLanguage("id", idLanguage);

  const result = sentiment.analyze(text, { language: "id" });

  return result;
}
