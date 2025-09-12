import React, { useEffect, useState } from "react"
import { faqData, loadFaq } from "../utils/faq-loader"

export default function FAQ() {
    const [faqs, setFaqs] = useState([])

    useEffect(() => {
        setFaqs(faqData)
        // Or use loadFaq() to fetch from JSON
        // loadFaq().then(data => setFaqs(data))
    }, [])

    return (
        <div>
            <h1 className="page-title">FAQs</h1>
            <div>
                {faqs.map((f, i) => (
                    <div key={i} className="card">
                        <p style={{fontWeight:600}}>{f.question}</p>
                        <p className="page-subtle" style={{marginTop:6}}>{f.answer}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
