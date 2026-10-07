// Background colour for each letter result. No status = letter not checked yet.
const STATUS_COLORS = {
    correct: "bg-green-600",   // right letter, right place
    present: "bg-yellow-500",  // in the word, wrong place
    absent: "bg-neutral-700",  // not in the word
};

export default function Cell({letter, status}){
    const color = STATUS_COLORS[status] ?? "bg-mist-950";
    return(
        <div className={`hover:w-22 hover:h-17 hover:shadow-2xl duration-200 font-custom flex items-center justify-center rounded-2xl text-white w-21.5 h-16 ${color} mt-1 text-shadow-white`}>
            <p className="text-center text-3xl">{letter}</p>
        </div>
    );
}
