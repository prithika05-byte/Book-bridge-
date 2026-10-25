
const KEY = "bookbridgeRequests";
const DB = "BookBridgePDFs";

function getRequests() {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
}

function saveRequests(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
}

// Student book request
function createRequest(title, donor, student) {
    if (!title || !donor || !student) {
        alert("All details are required!");
        return;
    }

    const requests = getRequests();

    requests.push({
        id: Date.now().toString(),
        title,
        donor,
        student,
        status: "Pending",
        pdfKey: null
    });

    saveRequests(requests);
    alert("Book request submitted!");
}

// Save PDF in browser IndexedDB
function openDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB, 1);

        req.onupgradeneeded = () => {
            req.result.createObjectStore("files");
        };

        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

async function storePDF(key, file) {
    if (!file || file.type !== "application/pdf") {
        throw new Error("Select a valid PDF file!");
    }

    const db = await openDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction("files", "readwrite");
        tx.objectStore("files").put(file, key);

        tx.oncomplete = () => {
            db.close();
            resolve();
        };

        tx.onerror = () => {
            db.close();
            reject(tx.error);
        };
    });
}

async function readPDF(key) {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction("files", "readonly");
        const req = tx.objectStore("files").get(key);

        req.onsuccess = () => {
            db.close();
            resolve(req.result);
        };

        req.onerror = () => {
            db.close();
            reject(req.error);
        };
    });
}

// Donor accepts or rejects
function donorDecision(id, decision) {
    const data = getRequests();
    const item = data.find(r => r.id === id);

    if (!item || item.status !== "Pending") return;

    item.status = decision;
    saveRequests(data);
}

// Donor uploads book PDF
async function uploadPDF(id, file) {
    const data = getRequests();
    const item = data.find(r => r.id === id);

    if (!item || item.status !== "Accepted") {
        throw new Error("First accept the request!");
    }

    const key = "book_" + id;
    await storePDF(key, file);

    item.pdfKey = key;
    saveRequests(data);
}

// Mark as completed
async function markCompleted(id) {
    const data = getRequests();
    const item = data.find(r => r.id === id);

    if (!item || item.status !== "Accepted") {
        throw new Error("Request must be accepted first!");
    }

    if (!item.pdfKey || !await readPDF(item.pdfKey)) {
        throw new Error("Upload the book PDF first!");
    }

    item.status = "Completed";
    saveRequests(data);
}

// Student downloads PDF
async function downloadPDF(id) {
    const item = getRequests().find(r => r.id === id);

    if (!item || item.status !== "Completed") {
        alert("Book is not completed yet!");
        return;
    }

    const file = await readPDF(item.pdfKey);

    if (!file) {
        alert("PDF file not found!");
        return;
    }

    const url = URL.createObjectURL(file);
    const a = document.createElement("a");

    a.href = url;
    a.download = item.title + ".pdf";
    a.click();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
