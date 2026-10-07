import Container from "./Components/Container"
import Header from "./Components/Header"

function App() {
  return (
    <div dir="rtl" className="min-h-screen bg-mist-950 flex flex-col gap-5  items-center">
      <Header/>
      <Container/>
    </div>
  )
}

export default App