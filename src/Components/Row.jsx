import Cell from "./Cell";

export default function Row({First, Second, Third, Fourth, Fifth}){


    return(
        <div  className="flex flex-row gap-2 p-2">
            <Cell letter={First}/>
            <Cell letter = {Second}/>
            <Cell letter = {Third}/>
            <Cell letter = {Fourth}/>
            <Cell letter = {Fifth}/>
        </div>
    );
}