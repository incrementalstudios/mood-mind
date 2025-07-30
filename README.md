# MoodMind

**MoodMind** is a lightweight web application designed to perform early screening of depression symptoms in tuberculosis (TB) patients, especially in low-resource settings. It utilizes automatic speech recognition and sentiment analysis tailored to the Indonesian language, enabling patients to receive emotional assessments and actionable recommendations based on voice input.

## 🧠 Key Features

- Voice-based input using Web Speech API
- Custom sentiment analysis with Indonesian lexicon
- Support for English and Bahasa Indonesia
- Depression detection based on emotional language cues
- Designed specifically with TB patients in mind
- Lightweight and easily deployable using Next.js

## 📦 Technologies Used

- **Frontend Framework:** Next.js (React-based)
- **Styling:** Tailwind CSS
- **Speech Recognition:** Web Speech API
- **Languages:** TypeScript & JavaScript
- **Sentiment Analysis Library:** [`sentiment`](https://www.npmjs.com/package/sentiment)

## 📂 Project Structure

```
/
├── app/            # Routing and page rendering
├── components/     # Reusable UI components
├── lib/            # Utility functions and configurations (e.g., i18n)
├── public/         # Static assets
├── styles/         # Global styles
```

## 🧪 Depression Detection Logic

1. Users speak responses to a set of system-generated prompts.
2. Responses are transcribed to text via SpeechRecognition API.
3. The transcribed text is analyzed using sentiment analysis.
4. The system calculates a score and suggests next steps if depression is detected.

### Sample Output

Example input:
> Saya merasa kosong dan hampa

Sentiment result:
```json
{
  "score": -5,
  "comparative": -1.25,
  "words": ["merasa", "kosong", "hampa"],
  "positive": [],
  "negative": ["merasa", "kosong", "hampa"]
}
```

## 🧪 How to Run Locally

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## 🔧 Configuration

- Configure multilingual support via `i18n`
- Customize the Indonesian sentiment lexicon under `lib/keywords.ts`
- Modify prompts in `lib/script.ts`

## 💡 Future Plans

- Integration with clinical information systems
- Machine learning enhancements for better accuracy
- Offline support and PWA capabilities

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
