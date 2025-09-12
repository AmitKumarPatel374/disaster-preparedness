import { openDB } from 'idb'


export async function getDB() {
    return openDB('disaster-db', 3, {
        upgrade(db, oldVersion) {
            if (!db.objectStoreNames.contains('faqs')) db.createObjectStore('faqs', { keyPath: 'id' })
            if (!db.objectStoreNames.contains('quizResults')) db.createObjectStore('quizResults', { keyPath: 'id', autoIncrement: true })
            if (!db.objectStoreNames.contains('gameResults')) db.createObjectStore('gameResults', { keyPath: 'id' })
        }
    })
}


export async function saveFaqs(faqArray) {
    const db = await getDB()
    const tx = db.transaction('faqs', 'readwrite')
    for (const f of faqArray) tx.store.put(f)
    await tx.done
}


export async function getAllFaqs() {
    const db = await getDB()
    return db.getAll('faqs')
}


export async function saveQuizResult(result) {
    const db = await getDB()
    return db.add('quizResults', result)
}


export async function getQuizResults() {
    const db = await getDB()
    return db.getAll('quizResults')
}