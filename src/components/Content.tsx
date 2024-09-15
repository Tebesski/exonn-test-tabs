import { Button } from "@mui/material"
import { useParams } from "react-router-dom"
import { useTabContext } from "../context/TabContext"

export default function Content() {
   const { tabId } = useParams<{ tabId: string }>()
   const { persistentData } = useTabContext()

   const displayedTab = persistentData.find((tab) => tab.id === Number(tabId))

   function clearLocalStorage() {
      localStorage.clear()
   }

   return (
      <section>
         <p>
            You are currently seeing: <b>{displayedTab?.name} tab</b>
         </p>
         <br></br>
         <div>
            <h2 style={{ color: "black", fontSize: "24px" }}>Tutorial:</h2>{" "}
            <ol className="list-decimal ml-8">
               <li>To pin a tab: right mouse button - pin</li>
               <li>To close a tab: click the 'x' button</li>
               <li>To move a tab: drag and drop</li>
            </ol>
            <Button
               variant="contained"
               disableElevation
               sx={{ marginLeft: 2, marginTop: 2 }}
               onClick={clearLocalStorage}
            >
               Clear localStorage
            </Button>
         </div>
      </section>
   )
}
