import React, { useEffect, useState } from "react"
import { getQuizResults } from "../utils/idb"

export default function Admin() {
    const [results, setResults] = useState([])
    const [filteredResults, setFilteredResults] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [filterModule, setFilterModule] = useState("all")

    // Fetch results from IndexedDB
    useEffect(() => {
        const fetchResults = async () => {
            try {
                const allResults = await getQuizResults()
                allResults.sort((a, b) => new Date(b.date) - new Date(a.date))
                setResults(allResults)
                setFilteredResults(allResults)
            } catch (err) {
                console.error("Error fetching quiz results:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchResults()
    }, [])

    // Filter & search logic
    useEffect(() => {
        let filtered = [...results]

        // Filter by module
        if (filterModule !== "all") {
            filtered = filtered.filter(r => r.quizId.includes(filterModule))
        }

        // Search by quizId
        if (search.trim() !== "") {
            filtered = filtered.filter(r =>
                r.quizId.toLowerCase().includes(search.toLowerCase())
            )
        }

        setFilteredResults(filtered)
    }, [results, search, filterModule])

    if (loading) return <div>Loading results...</div>

    return (
        <div>
            <h1 className="page-title">Admin Dashboard - Quiz Results</h1>

            {/* Filters */}
            <div style={{display:'flex',flexWrap:'wrap',gap:12,marginBottom:16}}>
                <input
                    type="text"
                    placeholder="Search by Quiz ID..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className=""
                    style={{border:'1px solid var(--border)', padding:8, borderRadius:8, minWidth:200}}
                />
                <select
                    value={filterModule}
                    onChange={e => setFilterModule(e.target.value)}
                    className=""
                    style={{border:'1px solid var(--border)', padding:8, borderRadius:8, minWidth:200}}
                >
                    <option value="all">All Modules</option>
                    <option value="earthquake">Earthquake</option>
                    <option value="flood">Flood</option>
                    <option value="fire">Fire</option>
                </select>
            </div>

            {/* Results Table */}
            {filteredResults.length === 0 ? (
                <p>No results found.</p>
            ) : (
                <div style={{overflowX:'auto'}}>
                    <table style={{minWidth:'100%', background:'#fff', border:'1px solid var(--border)', borderRadius:10, boxShadow:'var(--shadow-md)'}}>
                        <thead style={{background:'#f3f4f6'}}>
                            <tr>
                                <th style={{padding:'10px 12px', border:'1px solid var(--border)'}}>Quiz ID</th>
                                <th style={{padding:'10px 12px', border:'1px solid var(--border)'}}>Score</th>
                                <th style={{padding:'10px 12px', border:'1px solid var(--border)'}}>Total Questions</th>
                                <th style={{padding:'10px 12px', border:'1px solid var(--border)'}}>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredResults.map((r) => (
                                <tr key={r.id} style={{textAlign:'center'}}>
                                    <td style={{padding:'10px 12px', border:'1px solid var(--border)'}}>{r.quizId}</td>
                                    <td style={{padding:'10px 12px', border:'1px solid var(--border)'}}>{r.score}</td>
                                    <td style={{padding:'10px 12px', border:'1px solid var(--border)'}}>{r.total}</td>
                                    <td style={{padding:'10px 12px', border:'1px solid var(--border)'}}>
                                        {new Date(r.date).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
