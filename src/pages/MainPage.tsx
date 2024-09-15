import { DndContext } from "@dnd-kit/core"
import { Outlet } from "react-router-dom"
import ContentBox from "../components/ContentBox"
import TabContainer from "../components/TabContainer"
import { useTabContext } from "../context/TabContext"

export default function MainPage() {
   const { overflowTabs } = useTabContext()

   return (
      <div
         className={`h-svh flex flex-col relative transition-colors duration-1000 ${
            overflowTabs.length > 0 ? "bg-light-gray" : "bg-white"
         }`}
      >
         <DndContext>
            <TabContainer />
         </DndContext>

         {/* pages/Content */}
         <ContentBox>
            <Outlet />
         </ContentBox>
      </div>
   )
}
