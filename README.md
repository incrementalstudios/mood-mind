# MoodMind

**MoodMind** is a lightweight web application designed to perform early screening of depression symptoms in tuberculosis (TB) patients, especially in low-resource settings. It utilizes automatic speech recognition and sentiment analysis tailored to the Indonesian language, enabling patients to receive emotional assessments and actionable recommendations based on voice input.

## Project Structure

```
/
├── app/            # Routing and page rendering
├── components/     # Reusable UI components
├── lib/            # Utility functions and configurations (e.g., i18n)
├── public/         # Static assets
├── styles/         # Global styles
```

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

## How to Run Locally

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Configuration

- Configure multilingual support via `i18n`
- Customize the Indonesian sentiment lexicon under `lib/keywords.ts`
- Modify prompts in `lib/script.ts`

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
