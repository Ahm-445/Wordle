import { useEffect, useState } from "react"
import Row from "./Row"
import Keyboard from "./Keyboard"
import wordsCsv from "../../data/words.csv?raw"

// Each word's id is its position in data/words.csv (0 = first word after the header).
const WORDS = wordsCsv
    .split(/\r?\n/)
    .slice(1)
    .map((w) => w.trim())
    .filter(Boolean)
    .map((word, id) => ({ id, word }));

// Normalised word list, used to check that a guess is a real word.
const ANSWER_SET = new Set(WORDS.map((w) => normalize(w.word)));

const PASSED_KEY = "passedWordIds_v2"; // v2 = ids in data/words.csv

function getPassedIds(){
    try {
        const saved = JSON.parse(localStorage.getItem(PASSED_KEY));
        return Array.isArray(saved) ? saved : [];
    } catch {
        return [];
    }
}

// Saves the word's id when the player guesses it correctly, so it never appears again.
function markWordAsPassed(id){
    const passed = getPassedIds();
    if (passed.includes(id)) return;
    try {
        localStorage.setItem(PASSED_KEY, JSON.stringify([...passed, id]));
    } catch {
        // localStorage unavailable (private mode etc.) – nothing to save.
    }
}

function generateWord(){
    const passed = new Set(getPassedIds());
    let available = WORDS.filter((w) => !passed.has(w.id));

    // Player has passed every word: start over with the full list.
    if (available.length === 0) {
        try { localStorage.removeItem(PASSED_KEY); } catch { /* ignore */ }
        available = WORDS;
    }

    return available[Math.floor(Math.random() * available.length)];
}

const MAX_TRIES = 5;
const WORD_LENGTH = 5;
const ARABIC_LETTER = /^[\u0621-\u063A\u0641-\u064A]$/;

// Treat all hamza forms of alef (أ إ آ) as plain ا when comparing letters.
function normalize(text){
    return text.replace(/[أإآ]/g, "ا");
}

// Wordle scoring: "correct" = right place, "present" = in the word elsewhere, "absent" = not in it.
// Repeated letters are only marked as many times as they appear in the answer.
function scoreGuess(guess, answer){
    const g = [...normalize(guess)];
    const a = [...normalize(answer)];
    const result = Array(WORD_LENGTH).fill("absent");
    const remaining = {};

    g.forEach((letter, i) => {
        if (letter === a[i]) result[i] = "correct";
        else remaining[a[i]] = (remaining[a[i]] ?? 0) + 1;
    });
    g.forEach((letter, i) => {
        if (result[i] !== "correct" && remaining[letter] > 0) {
            result[i] = "present";
            remaining[letter]--;
        }
    });
    return result;
}

const STATUS_RANK = { absent: 1, present: 2, correct: 3 };

// Best result seen so far for each letter, used to colour the on-screen keyboard.
function getLetterStatuses(guesses, answer){
    const statuses = {};
    guesses.forEach((guess) => {
        const result = scoreGuess(guess, answer);
        [...normalize(guess)].forEach((letter, i) => {
            if ((STATUS_RANK[result[i]] ?? 0) > (STATUS_RANK[statuses[letter]] ?? 0)) {
                statuses[letter] = result[i];
            }
        });
    });
    return statuses;
}

// Turns a guess string into the props a Row expects.
function toRowProps(text = ""){
    const [First, Second, Third, Fourth, Fifth] = [...text];
    return { First, Second, Third, Fourth, Fifth };
}

export default function Container(){

    // Picked once per page load, so every refresh gives a new word.
    const [target] = useState(generateWord);
    const [guesses, setGuesses] = useState([]);     // submitted guesses
    const [current, setCurrent] = useState("");     // what the player is typing now
    const [status, setStatus] = useState("playing"); // "playing" | "won" | "lost"
    const [notice, setNotice] = useState("");        // short message, e.g. word not in list
    // Hide the notice after a moment.
    useEffect(() => {
        if (!notice) return;
        const timer = setTimeout(() => setNotice(""), 1800);
        return () => clearTimeout(timer);
    }, [notice]);

    function isValidGuess(word){
        return ANSWER_SET.has(normalize(word));
    }

    function submitGuess(){
        if ([...current].length !== WORD_LENGTH) {
            setNotice("أكمل الكلمة أولاً (٥ حروف)");
            return;
        }
        if (!isValidGuess(current)) {
            setNotice("الكلمة غير موجودة في القائمة");
            return;
        }

        const newGuesses = [...guesses, current];
        setGuesses(newGuesses);
        setCurrent("");

        if (normalize(current) === normalize(target.word)) {
            setStatus("won");
            markWordAsPassed(target.id);
        } else if (newGuesses.length === MAX_TRIES) {
            setStatus("lost");
        }
    }

    // Shared by the physical keyboard and the on-screen keyboard.
    // Best known result for each letter so far (used to colour and lock keys).
    const letterStatuses = getLetterStatuses(guesses, target.word);

    function handleKey(key){
        if (status !== "playing") return;

        if (key === "Enter") {
            submitGuess();
        } else if (key === "Backspace") {
            setCurrent((c) => [...c].slice(0, -1).join(""));
        } else if (ARABIC_LETTER.test(key)) {
            // Letters already shown grey are not in the word, so they can't be typed again.
            if (letterStatuses[normalize(key)] === "absent") {
                setNotice(`الحرف «${key}» غير موجود في الكلمة`);
                return;
            }
            setCurrent((c) => ([...c].length < WORD_LENGTH ? c + key : c));
        }
    }

    useEffect(() => {
        function handleKeyDown(e){
            if (e.ctrlKey || e.metaKey || e.altKey) return;
            handleKey(e.key);
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    });

    // Submitted guesses first, then the row being typed, then empty rows.
    const rows = guesses.map((text) => ({ text, statuses: scoreGuess(text, target.word) }));
    if (status === "playing") rows.push({ text: current, statuses: [] });
    while (rows.length < MAX_TRIES) rows.push({ text: "", statuses: [] });

    return(
        // Phone: board on top, keyboard underneath. Desktop: keyboard to the right of the board.
        <div className="flex flex-col md:flex-row-reverse items-center justify-center gap-6 lg:gap-10 w-full pb-6">
            <div className=" rounded-3xl w-90 h-106 flex-col bg-mist-900 shrink-0">
                {rows.map((row, i) => (
                    <Row key={i} {...toRowProps(row.text)} statuses={row.statuses} />
                ))}
            </div>

            <div className="flex flex-col items-center gap-4 w-full max-w-md md:max-w-sm lg:max-w-md">
                {notice && (
                    <p className="text-white text-xl font-custom bg-neutral-700 rounded-xl px-4 py-1">{notice}</p>
                )}
                {status === "won" && (
                    <p className="text-white text-2xl font-custom">أحسنت! الكلمة صحيحة 🎉</p>
                )}
                {status === "lost" && (
                    <p className="text-white text-2xl font-custom text-center">انتهت المحاولات، الكلمة كانت: {target.word}</p>
                )}
                {status !== "playing" && (
                    <button
                        onClick={() => window.location.reload()}
                        className="text-white text-xl font-custom bg-mist-900 hover:bg-mist-800 rounded-2xl px-6 py-2 duration-200"
                    >
                        كلمة جديدة
                    </button>
                )}

                <Keyboard
                    onKey={handleKey}
                    letterStatuses={letterStatuses}
                    normalize={normalize}
                />
            </div>
        </div>
    );
}
