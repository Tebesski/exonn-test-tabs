import { Outlet } from "react-router-dom"
import { TabProvider } from "./context/TabContext"

function App() {
   return (
      <div>
         <TabProvider>
            <Outlet />
         </TabProvider>
      </div>
   )
}

export default App
