import Row from "./Row"
export default function Container(){

    const letters = {First:"أ", Second:"س", Third:"ت", Fourth:"م", Fifth:"ر"};

    return(
        <div className=" rounded-3xl w-90 h-106 flex-col bg-mist-900">
            <Row 
                First={letters.First} 
                Second={letters.Second} 
                Third={letters.Third}
                Fourth={letters.Fourth}
                Fifth={letters.Fifth}
                />
            <Row/>
            <Row/>
            <Row/>
            <Row/>
        </div>
    );
}


function generateWord(){
    
}
