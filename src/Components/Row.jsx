import Cell from "./Cell";

// statuses: optional array of 5 results ("correct" | "present" | "absent"), in letter order.
export default function Row({First, Second, Third, Fourth, Fifth, statuses = []}){


    return(
        <div  className="flex flex-row gap-2 p-2">
            <Cell letter={First} status={statuses[0]}/>
            <Cell letter = {Second} status={statuses[1]}/>
            <Cell letter = {Third} status={statuses[2]}/>
            <Cell letter = {Fourth} status={statuses[3]}/>
            <Cell letter = {Fifth} status={statuses[4]}/>
        </div>
    );
}
