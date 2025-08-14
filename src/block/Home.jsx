
import { Link } from "react-router-dom"
import { FaTwitter, FaFacebookF, FaInstagram, FaLinkedinIn, FaGithub, FaRegCopy, FaStop } from "react-icons/fa"
import { useState, useEffect, useCallback } from "react"
import { createWorker } from "tesseract.js"

export default function Home() {
  const [extractedText, setExtractedText] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)
  const [targetLanguage, setTargetLanguage] = useState("en")
  const [isTranslating, setIsTranslating] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speechSynthesis, setSpeechSynthesis] = useState(null)

  const message = [
    "Extracts text from images and documents",
    "Uses advanced OCR for high accuracy",
    "Supports multiple languages and file types",
    "Ideal for students, professionals, businesses",
  ]
  const social = [
    { i: <FaTwitter size={20} />, l: "https://twitter.com" },
    { i: <FaFacebookF size={20} />, l: "https://facebook.com" },
    { i: <FaInstagram size={20} />, l: "https://instagram.com" },
    { i: <FaLinkedinIn size={20} />, l: "https://linkedin.com" },
    { i: <FaGithub size={20} />, l: "https://github.com" },
  ]

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSpeechSynthesis(window.speechSynthesis)
    }
  }, [])

  const getLanguageCode = (langCode) => {
    const languageMap = {
      af: "af-ZA", // Afrikaans (South Africa)
      am: "am-ET", // Amharic (Ethiopia)
      ar: "ar-SA", // Arabic (Saudi Arabia)
      bn: "bn-BD", // Bengali (Bangladesh)
      bg: "bg-BG", // Bulgarian (Bulgaria)
      my: "my-MM", // Burmese (Myanmar)
      zh: "zh-CN", // Chinese (Simplified, China)
      hr: "hr-HR", // Croatian (Croatia)
      cs: "cs-CZ", // Czech (Czech Republic)
      da: "da-DK", // Danish (Denmark)
      nl: "nl-NL", // Dutch (Netherlands)
      en: "en-US", // English (United States)
      et: "et-EE", // Estonian (Estonia)
      fi: "fi-FI", // Finnish (Finland)
      fr: "fr-FR", // French (France)
      de: "de-DE", // German (Germany)
      el: "el-GR", // Greek (Greece)
      he: "he-IL", // Hebrew (Israel)
      hi: "hi-IN", // Hindi (India)
      hu: "hu-HU", // Hungarian (Hungary)
      is: "is-IS", // Icelandic (Iceland)
      id: "id-ID", // Indonesian (Indonesia)
      it: "it-IT", // Italian (Italy)
      ja: "ja-JP", // Japanese (Japan)
      ko: "ko-KR", // Korean (South Korea)
      lo: "lo-LA", // Lao (Laos)
      lv: "lv-LV", // Latvian (Latvia)
      lt: "lt-LT", // Lithuanian (Lithuania)
      ms: "ms-MY", // Malay (Malaysia)
      mt: "mt-MT", // Maltese (Malta)
      mr: "mr-IN", // Marathi (India)
      ne: "ne-NP", // Nepali (Nepal)
      no: "nb-NO", // Norwegian (Norway)
      pa: "pa-IN", // Punjabi (India)
      fa: "fa-IR", // Persian (Iran)
      pl: "pl-PL", // Polish (Poland)
      pt: "pt-BR", // Portuguese (Brazil)
      ro: "ro-RO", // Romanian (Romania)
      ru: "ru-RU", // Russian (Russia)
      sr: "sr-RS", // Serbian (Serbia)
      si: "si-LK", // Sinhala (Sri Lanka)
      sk: "sk-SK", // Slovak (Slovakia)
      sl: "sl-SI", // Slovenian (Slovenia)
      es: "es-ES", // Spanish (Spain)
      sw: "sw-KE", // Swahili (Kenya)
      sv: "sv-SE", // Swedish (Sweden)
      ta: "ta-IN", // Tamil (India)
      te: "te-IN", // Telugu (India)
      th: "th-TH", // Thai (Thailand)
      tr: "tr-TR", // Turkish (Turkey)
      uk: "uk-UA", // Ukrainian (Ukraine)
      ur: "ur-PK", // Urdu (Pakistan)
      vi: "vi-VN", // Vietnamese (Vietnam)
      xh: "xh-ZA", // Xhosa (South Africa)
      yo: "yo-NG", // Yoruba (Nigeria)
      zu: "zu-ZA", // Zulu (South Africa)
      km: "km-KH", // Khmer (Cambodia)
      ga: "ga-IE", // Irish (Ireland)
    }
    return languageMap[langCode] || "en-US"
  }

  const speakText = () => {
    if (!speechSynthesis || !translatedText || translatedText === "Translating..." || isSpeaking) {
      return
    }

    // Cancel any ongoing speech
    speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(translatedText)
    const targetLang = getLanguageCode(targetLanguage)
    utterance.lang = targetLang

    utterance.rate = 0.85 // Slightly slower for better clarity
    utterance.pitch = 1.0
    utterance.volume = 1.0

    const voices = speechSynthesis.getVoices()
    const preferredVoice = voices.find((voice) => voice.lang === targetLang || voice.lang.startsWith(targetLanguage))
    if (preferredVoice) {
      utterance.voice = preferredVoice
    }

    utterance.onstart = () => {
      setIsSpeaking(true)
    }

    utterance.onend = () => {
      setIsSpeaking(false)
    }

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event.error)
      setIsSpeaking(false)
    }

    speechSynthesis.speak(utterance)
  }

  const stopSpeaking = () => {
    if (speechSynthesis && isSpeaking) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"]
    if (!validTypes.includes(file.type)) {
      alert("Please upload a valid file type (JPG, JPEG, PNG, PDF)")
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("File size exceeds 10MB limit")
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setImageUrl(objectUrl)
    setIsProcessing(true)
    setExtractedText("Processing...")
    setTranslatedText("")

    try {
      const worker = await createWorker("eng")
      const { data } = await worker.recognize(file)
      await worker.terminate()
      setExtractedText(data.text)
    } catch (error) {
      setExtractedText("Error extracting text: " + error.message)
      console.error("OCR Error:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const translateText = useCallback(
    async (text) => {
      if (!text) return

      setIsTranslating(true)
      setTranslatedText("Translating...")

      try {
        const response = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLanguage}`,
        )

        if (!response.ok) {
          throw new Error("Translation failed: Network response was not ok.")
        }

        const data = await response.json()
        if (data && data.responseData && data.responseData.translatedText) {
          setTranslatedText(data.responseData.translatedText)
        } else {
          throw new Error("No translated text found in response.")
        }
      } catch (error) {
        setTranslatedText("Error translating text: " + error.message)
        console.error("Translation Error:", error)
      } finally {
        setIsTranslating(false)
      }
    },
    [targetLanguage],
  )

  // Handle language dropdown change
  const handleLanguageChange = (e) => {
    setTargetLanguage(e.target.value)
    if (isSpeaking) {
      stopSpeaking()
    }
  }

  // Run translation whenever language OR extracted text changes
  useEffect(() => {
    if (extractedText && extractedText !== "Processing..." && extractedText.length > 0) {
      translateText(extractedText)
    }
  }, [targetLanguage, extractedText, translateText])

  // Cleanup URL object
  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl)
      }
    }
  }, [imageUrl])

  function Copy(d) {
    const t = document.getElementById(d).textContent
    const temp = document.createElement("textarea")
    temp.value = t
    document.body.appendChild(temp)
    temp.select()
    document.execCommand("copy")
    document.body.removeChild(temp)
    // alert("Copied the text: " + t.value);
  }

  const SpeakerIcon = () => (
    <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="speakerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.1" />
        </filter>
      </defs>

      {/* Outer circle with gradient */}
      <circle cx="16" cy="16" r="15" fill="url(#speakerGradient)" filter="url(#shadow)" />

      {/* Speaker cone */}
      <path d="M10 12v8l6-3V9l-6 3z" fill="white" fillOpacity="0.95" />

      {/* Sound waves with animation */}
      <g className="sound-waves">
        <path
          d="M18 14c0-.5-.2-1-.6-1.4M18 18c0 .5-.2 1-.6 1.4"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          fillOpacity="0.9"
        />
        <path
          d="M20 12c0-1.1-.4-2.1-1.2-2.8M20 20c0 1.1-.4 2.1-1.2 2.8"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          fillOpacity="0.7"
        />
        <path
          d="M22 10c0-1.7-.7-3.3-1.8-4.4M22 22c0 1.7-.7 3.3-1.8 4.4"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          fillOpacity="0.5"
        />
      </g>

      <style jsx>{`
        .sound-waves {
          animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
      `}</style>
    </svg>
  )

  return (
    <div className="home">
      <div className="left">
        <p className="left-title">Textracty</p>
        <ul className="left-desc">
          {message.map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>
        <div className="left-btn">
          <Link to={"/login"} className="btn">
            Login
          </Link>
          <Link to={"/signup"} className="btn">
            Signup
          </Link>
        </div>
        <span className="left-social">
          {social.map((d, i) => (
            <a href={d.l} key={i}>
              {" "}
              {d.i}{" "}
            </a>
          ))}
        </span>
      </div>

      <div className="right">
        <p className="right-title">Upload your image</p>
        <label htmlFor="file-upload" className="fileupload">
          <input id="file-upload" type="file" onChange={handleFileUpload} hidden />
          <span className="right-desc">
            <p>Supported file types: JPG, JPEG, PNG, PDF</p>
            <p>Max file size: 10MB</p>
          </span>
          <i className="fas fa-cloud-upload-alt"></i>
          <p className="right-upload">{isProcessing ? "Processing..." : "Upload File"}</p>
        </label>

        {imageUrl && (
          <div className="image-preview-container">
            <p className="right-title">Image Preview</p>
            <div className="image-preview">
              <img src={imageUrl || "/placeholder.svg"} alt="Preview" />
            </div>
          </div>
        )}

        <p className="right-title">Extracted Text</p>
        <div className="extracted-text" id="exetext">
          {extractedText}
          <button className="copy-btn" onClick={() => Copy("exetext")}>
            <FaRegCopy />
            Copy
          </button>
        </div>

        <div className="translation-section">
          <div className="translation-header">
            <p className="right-title">Translated Text</p>
            <select
              value={targetLanguage}
              onChange={handleLanguageChange}
              className="language-selector"
              disabled={isTranslating || !extractedText || extractedText === "Processing..."}
            >
              <option value="af">Afrikaans</option>
              <option value="am">Amharic</option>
              <option value="ar">Arabic</option>
              <option value="bn">Bengali</option>
              <option value="bg">Bulgarian</option>
              <option value="my">Burmese</option>
              <option value="zh">Chinese</option>
              <option value="hr">Croatian</option>
              <option value="cs">Czech</option>
              <option value="da">Danish</option>
              <option value="nl">Dutch</option>
              <option value="en">English</option>
              <option value="et">Estonian</option>
              <option value="fi">Finnish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="el">Greek</option>
              <option value="he">Hebrew</option>
              <option value="hi">Hindi</option>
              <option value="hu">Hungarian</option>
              <option value="is">Icelandic</option>
              <option value="id">Indonesian</option>
              <option value="it">Italian</option>
              <option value="ja">Japanese</option>
              <option value="ko">Korean</option>
              <option value="lo">Lao</option>
              <option value="lv">Latvian</option>
              <option value="lt">Lithuanian</option>
              <option value="ms">Malay</option>
              <option value="mt">Maltese</option>
              <option value="mr">Marathi</option>
              <option value="ne">Nepali</option>
              <option value="no">Norwegian</option>
              <option value="pa">Punjabi</option>
              <option value="fa">Persian</option>
              <option value="pl">Polish</option>
              <option value="pt">Portuguese</option>
              <option value="ro">Romanian</option>
              <option value="ru">Russian</option>
              <option value="sr">Serbian</option>
              <option value="si">Sinhala</option>
              <option value="sk">Slovak</option>
              <option value="sl">Slovenian</option>
              <option value="es">Spanish</option>
              <option value="sw">Swahili</option>
              <option value="sv">Swedish</option>
              <option value="ta">Tamil</option>
              <option value="te">Telugu</option>
              <option value="th">Thai</option>
              <option value="tr">Turkish</option>
              <option value="uk">Ukrainian</option>
              <option value="ur">Urdu</option>
              <option value="vi">Vietnamese</option>
              <option value="xh">Xhosa</option>
              <option value="yo">Yoruba</option>
              <option value="zu">Zulu</option>
              <option value="km">Khmer</option>
              <option value="ga">Irish</option>
            </select>
          </div>
          <div className="extracted-text" id="translatetext">
            {isTranslating ? "Translating..." : translatedText}
            <div className="action-buttons">
              <button className="copy-btn" onClick={() => Copy("translatetext")}>
                <FaRegCopy />
                Copy
              </button>
              {speechSynthesis && translatedText && translatedText !== "Translating..." && (
                <>
                  {!isSpeaking ? (
                    <button className="copy-btn" onClick={speakText} title="Hear translated text">
                      <SpeakerIcon />
                      Hear
                    </button>
                  ) : (
                    <button className="copy-btn" onClick={stopSpeaking} title="Stop audio">
                      <FaStop />
                      Stop
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}