import React, { useEffect, useRef, useState } from 'react'
import Fuse from 'fuse.js'
import { saveFaqs, getAllFaqs } from '../utils/idb'


export default function Chatbot() {
    const [input, setInput] = useState('')
    const [reply, setReply] = useState('यहाँ आपका उत्तर दिखेगा।')
    const [fuse, setFuse] = useState(null)
    const [listening, setListening] = useState(false)
    const [selectedLang, setSelectedLang] = useState('hi-IN') // default Hindi
    const [ttsEnabled, setTtsEnabled] = useState(true)
    const recognitionRef = useRef(null)
    const listeningDesiredRef = useRef(false)
    const utterRef = useRef(null)
    const [voices, setVoices] = useState([])


    useEffect(() => {
        (async () => {
            try {
                // 1) Try to seed from IndexedDB
                let faqs = await getAllFaqs()

                // 2) If empty, try network
                if (!faqs || faqs.length === 0) {
                    try {
                        const res = await fetch('/data/faq.json', { cache: 'no-cache' })
                        if (res.ok) {
                            faqs = await res.json()
                            await saveFaqs(faqs)
                        }
                    } catch (_) {
                        // ignore network errors
                    }
                }

                // 3) If still empty (first run fully offline), seed minimal built-in fallback
                if (!faqs || faqs.length === 0) {
                    faqs = [
                        { id: 'fallback_earthquake', questions: ['earthquake safety', 'भूकंप के समय क्या करें'], answer: 'मजबूत मेज़/डेस्क के नीचे छुपें, खिड़कियों से दूर रहें, लिफ्ट का उपयोग न करें।' },
                        { id: 'fallback_fire', questions: ['fire safety', 'आग लगने पर क्या करें'], answer: 'धुएँ से बचने के लिए झुककर चलें, नाक-मुँह ढकें, सीढ़ियों से बाहर निकलें।' }
                    ]
                }

                const normalize = (s) => (s || '').toString().toLowerCase().trim()
                const list = faqs
                    .filter(f => Array.isArray(f.questions) && typeof f.answer === 'string')
                    .map(f => ({ id: f.id, text: normalize([...f.questions, f.answer].join(' | ')), answer: f.answer }))
                const fuseInstance = new Fuse(list, {
                    keys: ['text'],
                    includeScore: true,
                    threshold: 0.5,
                    distance: 300,
                    ignoreLocation: true,
                    minMatchCharLength: 2
                })
                setFuse(fuseInstance)
            } catch (e) {
                // As a last resort, create an empty index so UI is usable
                setFuse(new Fuse([], { keys: ['text'], threshold: 0.5 }))
            }
        })()
    }, [])

    // Load TTS voices
    useEffect(() => {
        const synth = window.speechSynthesis
        if (!synth) return
        const updateVoices = () => setVoices(synth.getVoices())
        updateVoices()
        synth.onvoiceschanged = updateVoices
        return () => { synth.onvoiceschanged = null }
    }, [])

    // Speech synthesis helper
    const speak = (text) => {
        if (!ttsEnabled) return
        try {
            const synth = window.speechSynthesis
            if (!synth) return

            // pause recognition to prevent it capturing TTS audio
            const wasListening = listeningDesiredRef.current
            if (wasListening) stopListening()

            const utter = new SpeechSynthesisUtterance(text)
            utter.lang = selectedLang
            utter.rate = 1
            utter.pitch = 1
            utter.volume = 1
            const voice = voices.find(v => v.lang === selectedLang) || voices.find(v => v.lang?.startsWith(selectedLang.split('-')[0]))
            if (voice) utter.voice = voice
            utterRef.current = utter
            synth.cancel()
            synth.speak(utter)
            utter.onend = () => {
                // resume recognition if user wanted it on
                if (wasListening) startListening()
            }
        } catch (_) {
            // ignore TTS errors
        }
    }

    // Initialize or reuse recognition instance
    const getRecognition = () => {
        if (recognitionRef.current) return recognitionRef.current
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition
        if (!SR) return null
        const rec = new SR()
        rec.continuous = true
        rec.interimResults = true
        rec.maxAlternatives = 1
        recognitionRef.current = rec
        return rec
    }

    const startListening = () => {
        const rec = getRecognition()
        if (!rec) {
            setReply('आपके ब्राउज़र में वॉइस रिकग्निशन उपलब्ध नहीं है।')
            return
        }
        try {
            if (listening) return
            listeningDesiredRef.current = true
            let finalText = ''
            rec.lang = selectedLang
            rec.onstart = () => setListening(true)
            rec.onend = () => {
                setListening(false)
                // Auto-restart after brief delay if user still wants to listen
                if (listeningDesiredRef.current) {
                    setTimeout(() => {
                        try { rec.start() } catch (_) {}
                    }, 250)
                }
            }
            rec.onerror = () => {
                setListening(false)
                // Attempt gentle restart after delay if still desired
                if (listeningDesiredRef.current) {
                    setTimeout(() => {
                        try { rec.start() } catch (_) {}
                    }, 400)
                }
            }
            rec.onresult = (e) => {
                let interim = ''
                for (let i = e.resultIndex; i < e.results.length; i++) {
                    const transcript = e.results[i][0].transcript
                    if (e.results[i].isFinal) {
                        finalText += transcript + ' '
                    } else {
                        interim += transcript
                    }
                }
                const combined = (finalText || interim).trim()
                if (combined) setInput(combined)
                // When a final segment captured, ask
                if (finalText.trim()) {
                    askFromText(finalText.trim())
                    finalText = ''
                }
            }
            rec.start()
        } catch (_) {
            setListening(false)
        }
    }

    const stopListening = () => {
        const rec = recognitionRef.current
        if (!rec) return
        listeningDesiredRef.current = false
        try { rec.stop() } catch (_) {}
        setListening(false)
    }

    const askFromText = async (text) => {
        const prev = input
        try {
            // temporarily set input for processing
            setInput(text)
            await ask(true)
        } finally {
            // restore input box to recognized text
            setInput(text || prev)
        }
    }


    const ask = async (skipSpeak = false) => {
        if (!input) return setReply('कृपया अपना सवाल लिखिए।')
        if (!fuse) return setReply('कृपया थोड़ी देर प्रतीक्षा करें...')

        const normalize = (s) => (s || '').toString().toLowerCase().trim()
        const query = normalize(input)

        // 1) Try offline FAQs first (full sentence)
        let results = fuse.search(query)
        if (results.length > 0 && results[0].score <= 0.7) {
            const answer = results[0].item.answer
            setReply(answer)
            if (!skipSpeak) speak(answer)
            return
        }

        // 1b) Token-based search to handle long sentences
        const tokens = query.split(/[^\p{L}\p{N}]+/u).filter(t => t.length >= 3)
        for (const t of tokens) {
            results = fuse.search(t)
            if (results.length > 0 && results[0].score <= 0.65) {
                const answer = results[0].item.answer
                setReply(answer)
                if (!skipSpeak) speak(answer)
                return
            }
        }

        // 2) If online, try Wikipedia summary API as fallback
        try {
            if (navigator.onLine) {
                // First search for a relevant page title
                const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json&origin=*`
                const sres = await fetch(searchUrl)
                if (sres.ok) {
                    const sdata = await sres.json()
                    const title = sdata?.query?.search?.[0]?.title
                    if (title) {
                        const sumUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
                        const sumRes = await fetch(sumUrl)
                        if (sumRes.ok) {
                            const sum = await sumRes.json()
                            if (sum && sum.extract) {
                                setReply(sum.extract)
                                if (!skipSpeak) speak(sum.extract)
                                return
                            }
                        }
                    }
                }
            }
        } catch (e) {
            // ignore network errors and fall back to generic message
        }

        const fallback = 'माफ़ कीजिए, अभी सटीक उत्तर नहीं मिला। बेहतर कीवर्ड आज़माएँ या ऑनलाइन होने पर फिर कोशिश करें।'
        setReply(fallback)
        if (!skipSpeak) speak(fallback)
    }


    return (
        <div className="card">
            <h3 style={{fontWeight:800, marginTop:0}}>Assistant</h3>
            <div className="chatbox">
                <select value={selectedLang} onChange={(e)=> setSelectedLang(e.target.value)}>
                    <option value="hi-IN">Hindi (hi-IN)</option>
                    <option value="en-US">English (en-US)</option>
                    <option value="mr-IN">Marathi (mr-IN)</option>
                    <option value="bn-IN">Bengali (bn-IN)</option>
                    <option value="ta-IN">Tamil (ta-IN)</option>
                    <option value="te-IN">Telugu (te-IN)</option>
                    <option value="gu-IN">Gujarati (gu-IN)</option>
                    <option value="kn-IN">Kannada (kn-IN)</option>
                </select>
                <input value={input} onChange={e => setInput(e.target.value)} placeholder="अपना सवाल लिखें..." style={{ flex: 1 }} />
                <button onClick={()=> listening ? stopListening() : startListening()} className="btn" title="Voice input">
                    {listening ? '🛑' : '🎙️'}
                </button>
                <button onClick={()=> setTtsEnabled(v=>!v)} className="btn" title="Toggle voice output">
                    {ttsEnabled ? '🔊' : '🔇'}
                </button>
                <button onClick={()=> ask()} className="btn">पूछें</button>
            </div>
            <div className="reply">{reply}</div>
        </div>
    )
}