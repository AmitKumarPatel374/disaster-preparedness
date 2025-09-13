import React, { useEffect, useState } from "react"
import { faqData, loadFaq } from "../utils/faq-loader"

export default function FAQ() {
    const [faqs, setFaqs] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        try {
            console.log('FAQ Data:', faqData)
            if (faqData && faqData.length > 0) {
                setFaqs(faqData)
            } else {
                // Fallback FAQ data
                const fallbackData = [
                    {
                        question: "What should I do during an earthquake?",
                        answer: "Drop, cover, and hold on. Get under a sturdy table or desk and hold on until the shaking stops.",
                        category: "earthquake"
                    },
                    {
                        question: "How can I prepare for a flood?",
                        answer: "Create an emergency kit, know your evacuation routes, and stay informed about weather conditions.",
                        category: "flood"
                    }
                ]
                setFaqs(fallbackData)
            }
            setLoading(false)
        } catch (err) {
            console.error('Error loading FAQ data:', err)
            setError(err.message)
            setLoading(false)
        }
    }, [])

    const categories = [
        { id: 'all', name: 'All Questions', icon: '📋' },
        { id: 'earthquake', name: 'Earthquake', icon: '🌍' },
        { id: 'fire', name: 'Fire Safety', icon: '🔥' },
        { id: 'flood', name: 'Flood', icon: '🌊' },
        { id: 'cyclone', name: 'Cyclone', icon: '🌀' },
        { id: 'tsunami', name: 'Tsunami', icon: '🌊' },
        { id: 'general', name: 'General Safety', icon: '🛡️' }
    ]

    const filteredFaqs = faqs.filter(faq => {
        const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        
        const matchesCategory = selectedCategory === 'all' || 
            faq.category === selectedCategory ||
            (selectedCategory === 'general' && !['earthquake', 'fire', 'flood', 'cyclone', 'tsunami'].includes(faq.category))
        
        return matchesSearch && matchesCategory
    })

    if (loading) {
        return (
            <div className="faq-page">
                <div className="faq-hero">
                    <h1 className="page-title">Frequently Asked Questions</h1>
                    <p className="page-subtle">Loading...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="faq-page">
                <div className="faq-hero">
                    <h1 className="page-title">Frequently Asked Questions</h1>
                    <p className="page-subtle" style={{color: 'var(--error)'}}>Error loading FAQ data: {error}</p>
                </div>
            </div>
        )
    }

    console.log('FAQ Component rendering, faqs count:', faqs.length)
    
    return (
        <div className="faq-page">
            <div className="faq-hero">
                <h1 className="page-title">Frequently Asked Questions</h1>
                <p className="page-subtle">Find answers to common questions about disaster preparedness and safety</p>
                <p style={{color: 'var(--text-muted)', fontSize: '14px'}}>Total FAQs: {faqs.length}</p>
            </div>

            <div className="faq-controls">
                <div className="search-section">
                    <div className="search-box">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search questions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </div>
                
                <div className="category-filters">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(category.id)}
                        >
                            <span className="category-icon">{category.icon}</span>
                            <span className="category-name">{category.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="faq-content">
                {filteredFaqs.length === 0 ? (
                    <div className="no-results">
                        <div className="no-results-icon">❓</div>
                        <h3>No questions found</h3>
                        <p>Try adjusting your search or category filter</p>
                    </div>
                ) : (
                    <div className="faq-list">
                        {filteredFaqs.map((faq, i) => (
                            <div key={i} className="faq-item">
                                <div className="faq-question">
                                    <h3 className="question-title">
                                        {faq.question}
                                    </h3>
                                </div>
                                <div className="faq-answer">
                                    <p>{faq.answer}</p>
                                </div>
                                <div className="faq-category">
                                    <span className="category-badge">{faq.category || 'GENERAL'}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="faq-footer">
                <div className="help-section">
                    <h3>Still have questions?</h3>
                    <p>If you can't find the answer you're looking for, please contact our support team.</p>
                    <div className="help-actions">
                        <button className="btn btn-primary">Contact Support</button>
                        <button className="btn btn-secondary">Submit Question</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
