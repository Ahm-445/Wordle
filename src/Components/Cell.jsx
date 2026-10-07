export default function Cell({letter}){
    return(
        <div className=" hover:w-22 hover:h-17 hover:shadow-2xl duration-200 font-custom flex items-center justify-center rounded-2xl text-white w-21.5 h-16 bg-mist-950 mt-1 text-shadow-white">
            <p className="text-center text-3xl">{letter}</p>
        </div>
    );
}