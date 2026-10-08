// On-screen Arabic keyboard, so the game can be played on phones.
const KEY_ROWS = [
    ["ض", "ص", "ث", "ق", "ف", "غ", "ع", "ه", "خ", "ح", "ج", "د"],
    ["ش", "س", "ي", "ب", "ل", "ا", "ت", "ن", "م", "ك", "ط"],
    ["ئ", "ء", "ؤ", "ر", "ى", "ة", "و", "ز", "ظ", "ذ"],
    ["Enter", "أ", "إ", "آ", "Backspace"],
];

const KEY_LABELS = { Enter: "إدخال", Backspace: "⌫" };

const STATUS_COLORS = {
    correct: "bg-green-600",
    present: "bg-yellow-500",
    absent: "bg-neutral-800 text-neutral-500 opacity-30 cursor-not-allowed",
};

// letterStatuses: { letter: "correct" | "present" | "absent" } for letters already guessed.
export default function Keyboard({onKey, letterStatuses = {}, normalize = (l) => l}){
    return(
        <div className="flex flex-col gap-1.5 w-full max-w-md px-2">
            {KEY_ROWS.map((row, i) => (
                <div key={i} className="flex flex-row justify-center gap-1">
                    {row.map((key) => {
                        const isAction = key in KEY_LABELS;
                        const keyStatus = isAction ? undefined : letterStatuses[normalize(key)];
                        const color = STATUS_COLORS[keyStatus] ?? "bg-mist-900 hover:bg-mist-800";
                        return(
                            <button
                                key={key}
                                type="button"
                                // Keep focus off the button, so a physical Enter doesn't also "click" it.
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => onKey(key)}
                                // Letters known to be absent are locked.
                                disabled={keyStatus === "absent"}
                                className={`${isAction ? "flex-[1.6] text-base" : "flex-1 text-xl"} ${color} h-12 min-w-0 rounded-lg text-white font-custom duration-150 active:scale-95`}
                            >
                                {KEY_LABELS[key] ?? key}
                            </button>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}
