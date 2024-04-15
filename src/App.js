import Home from "./Components/Home"
import { MoralisProvider } from "react-moralis";


const App = () => {


  return (
    <MoralisProvider initializeOnMount = {false}>
        <Home />
     </MoralisProvider> 
  )   
};

export default App;