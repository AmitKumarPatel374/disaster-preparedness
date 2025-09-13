// faq-loader.js in src/utils
// This file exports FAQ data or a loader function

// Static FAQ data
export const faqData = [
    {
        question: "भूकंप आने पर सबसे पहला कदम क्या होना चाहिए?",
        answer: "सबसे पहले शांत रहें और किसी मजबूत मेज़ या डेस्क के नीचे छिपें।",
        category: "earthquake"
    },
    {
        question: "बाढ़ के दौरान सुरक्षित स्थान कैसे चुनें?",
        answer: "उच्च स्थान चुनें और पानी से भरे रास्तों से बचें।",
        category: "flood"
    },
    {
        question: "आग लगने पर क्या करें?",
        answer: "धुआँ कम हो उसे नाक और मुँह से रोकें, और निकासी मार्ग की ओर जल्दी निकलें।",
        category: "fire"
    },
    {
        question: "Quiz परिणाम कहाँ save होते हैं?",
        answer: "Quiz परिणाम browser के IndexedDB में save होते हैं।",
        category: "general"
    },
    {
        question: "Simulation offline कैसे चलेगी?",
        answer: "Phaser-based simulation PWA में cache होती है, इसलिए एक बार load होने के बाद offline भी काम करेगी।",
        category: "general"
    }
]

// Loader function (if you want to fetch JSON file)
export const loadFaq = async () => {
    try {
        const res = await fetch("/data/faq.json")
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        return data
    } catch (err) {
        console.error("Error loading FAQ:", err)
        return []
    }
}
