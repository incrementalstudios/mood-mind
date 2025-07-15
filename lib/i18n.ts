import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        start_conversation: "Start Interactive Conversation",
        how_to_use: "How to Use",
        description:
          "Your personal health companion. Start an interactive conversation to explore and understand your feelings and get the emotional support you need.",
        how_to_use_title: "Starting a Conversation",
        how_to_use_description:
          "Click the 'Start Interactive Conversation' button to begin a session with your mental health assistant.",
        how_to_use_feature_sound: "Sound Feature",
        how_to_use_feature_sound_on:
          "Click to activate the microphone and speak.",
        how_to_use_feature_sound_off: "Click to deactivate the microphone.",
        how_to_use_feature_sound_listen_on:
          "Click to listen to the assistant's last message.",
        how_to_use_feature_sound_listen_off: "Click to stop the voice.",
        how_to_use_feature_chat: "Send Message",
        how_to_use_feature_chat_send:
          "Click to send your message to the assistant.",
        how_to_use_feature_chat_description:
          "You can type your message in the input box or use the microphone feature to speak.",
        how_to_use_tips: "Usage Tips",
        how_to_use_tips_1:
          "Answer questions honestly for more accurate results",
        how_to_use_tips_2: "Use the microphone in a quiet environment",
        how_to_use_tips_3:
          "You can type if the voice feature does not work well",
        how_to_use_tips_4: "This conversation is private and secure",
        button_understand: "Understand",
        //  Question
        question_1: "In the past 2 weeks, how have you been feeling?",
        question_2:
          "In the past 2 weeks, how has your interest or enthusiasm been?",
        question_3:
          "In the past 2 weeks, have you experienced changes in weight or appetite? Please answer Yes or No",
        question_4:
          "In the past 2 weeks, have you had trouble sleeping or slept excessively? Please answer Yes or No",
        question_5:
          "In the past 2 weeks, have you felt anxious or that your movements are slower? Please answer Yes or No",
        question_6:
          "In the past 2 weeks, have you felt tired or lost energy? Please answer Yes or No",
        question_7:
          "In the past 2 weeks, have you felt worthless or guilty? Please answer Yes or No",
        question_8:
          "In the past 2 weeks, have you had recurring thoughts about death or hurting yourself? Please answer Yes or No",
        question_9: "Is the condition you are experiencing still manageable?",
        question_10:
          "Is the condition you are experiencing interfering with your social life or work?",
        risk_depression: "At Risk of Depression",
        risk_suspect_depression: "Suspected Depression",
        risk_not_depression: "Not Depressed",
        result_depression: "Your Test Result: ",
        result_depression_description:
          "Do not hesitate to talk to a doctor or other health professional if you feel anxious, sad, or are experiencing emotional difficulties. Remember that feeling anxious or sad is normal when facing illnesses like TB, but you do not have to face it alone. Try to avoid negative or excessive thoughts. Focus on positive things and do enjoyable activities to distract yourself from feelings of anxiety. <br> Stay healthy!",
        // ...add all your UI strings here
      },
    },
    id: {
      translation: {
        start_conversation: "Mulai Percakapan Interaktif",
        how_to_use: "Cara Penggunaan",
        description:
          "Teman pendamping kesehatan mental pribadi Anda. Mari mulai percakapan interaktif untuk mengeksplorasi dan memahami perasaan Anda serta mendapatkan dukungan emosional yang Anda butuhkan.",
        how_to_use_title: "Memulai Percakapan",
        how_to_use_description:
          "Klik tombol 'Mulai Percakapan Interaktif' untuk memulai sesi dengan asisten kesehatan mental Anda.",
        how_to_use_feature_sound: "Fitur Suara",
        how_to_use_feature_sound_on:
          "Klik untuk mengaktifkan mikrofon dan berbicara.",
        how_to_use_feature_sound_off: "Klik untuk menonaktifkan mikrofon.",
        how_to_use_feature_sound_listen_on:
          "Klik untuk mendengarkan pesan terakhir dari asisten.",
        how_to_use_feature_sound_listen_off: "Klik untuk menghentikan suara.",
        how_to_use_feature_chat: "Mengirim Pesan",
        how_to_use_feature_chat_send:
          "Klik untuk mengirim pesan Anda ke asisten.",
        how_to_use_feature_chat_description:
          "Anda dapat mengetik pesan di kotak input atau menggunakan fitur mikrofon untuk berbicara.",
        how_to_use_tips: "Tips Penggunaan",
        how_to_use_tips_1:
          "Jawab pertanyaan dengan jujur untuk hasil yang lebih akurat",
        how_to_use_tips_2: "Gunakan mikrofon di lingkungan yang tenang",
        how_to_use_tips_3:
          "Anda dapat mengetik jika fitur suara tidak berfungsi dengan baik",
        how_to_use_tips_4: "Percakapan ini bersifat pribadi dan aman",
        button_understand: "Mengerti",
        //  Question
        question_1: "Dalam 2 minggu terakhir, bagaimana perasaan Anda ?",
        question_2:
          "Dalam 2 minggu terakhir, bagaimana minat atau semangat Anda?",
        question_3:
          "Dalam 2 minggu terakhir, apakah Anda mengalami perubahan berat badan/ nafsu makan? Silakan menjawab Ya atau Tidak",
        question_4:
          "Dalam 2 minggu terakhir, apakah Anda mengalami sulit tidur atau tidur berlebihan? Silakan menjawab Ya atau Tidak",
        question_5:
          "Dalam 2 minggu terakhir, apakah Anda merasa cemas atau pergerakan Anda lebih lambat? Silakan menjawab Ya atau Tidak",
        question_6:
          "Dalam 2 minggu terakhir, apakah Anda merasa lelah atau kehilangan energi? Silakan menjawab Ya atau Tidak",
        question_7:
          "Dalam 2 minggu terakhir, apakah Anda merasa tidak berguna atau merasa bersalah? Silakan menjawab Ya atau Tidak",
        question_8:
          "Dalam 2 minggu terakhir, apakah Anda berpikir ulang tentang kematian atau menyakiti diri sendiri? Silakan menjawab Ya atau Tidak",
        question_9: "Apakah kondisi yang Anda rasakan masih bisa diatasi?",
        question_10:
          "Apakah kondisi yang Anda rasakan mengganggu kehidupan sosial atau pekerjaan Anda?",
        risk_depression: "Beresiko Depresi",
        risk_suspect_depression: "Suspek Depresi",
        risk_not_depression: "Tidak Depresi",
        result_depression: "Hasil Dari Test Anda: ",
        result_depression_description:
          "Jangan ragu untuk berbicara dengan dokter atau tenaga kesehatan lainnya jika Anda merasa cemas, sedih, atau mengalami kesulitan emosional. Ingatlah bahwa perasaan cemas atau sedih adalah hal yang wajar dalam menghadapi penyakit seperti TB, tetapi Anda tidak perlu menghadapinya sendirian. Cobalah untuk menghindari pemikiran negatif atau berlebihan. Fokuslah pada hal-hal positif dan lakukan aktivitas yang menyenangkan untuk mengalihkan perhatian dari perasaan cemas. <br> Salam sehat!",
        // ...add all your UI strings here
      },
    },
  },
  lng: "id", // default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
