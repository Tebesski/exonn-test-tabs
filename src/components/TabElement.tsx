import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { SvgIconComponent } from "@mui/icons-material"
import CancelIcon from "@mui/icons-material/Cancel"
import { IconButton, Tab } from "@mui/material"
import { MouseEvent, ReactNode } from "react"
import { useTabContext } from "../context/TabContext"
import { TabsType } from "../types/TabsType.enum"

type TabElementT = {
   children: ReactNode
   Icon: SvgIconComponent
   tabId: number
   isActive: boolean
   handleTabActivate: React.Dispatch<React.SetStateAction<number | null>>
   id: string
   onRemoveTab: () => void
   hoveredTab: number | null
   dragStarted: boolean
}

export default function TabElement({
   children,
   Icon,
   tabId,
   isActive,
   handleTabActivate,
   id,
   onRemoveTab,
   hoveredTab,
   dragStarted,
}: TabElementT) {
   const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: tabId })

   const style = {
      transform: CSS.Transform.toString(transform),
      transition,
   }

   const { navigateToTab, handleOpenContextMenu, setContextMenuType } =
      useTabContext()

   function handleClick() {
      navigateToTab(tabId)
      handleTabActivate(tabId)
   }

   function activateContextMenu(e: MouseEvent) {
      setContextMenuType(TabsType.VISIBLE)
      handleOpenContextMenu(e, tabId)
   }

   const isHovered = hoveredTab === tabId

   return (
      <div
         id={id}
         className="flex flex-auto items-center relative"
         ref={setNodeRef}
         style={style}
         {...attributes}
         {...listeners}
      >
         <Tab
            icon={<Icon sx={{ marginBottom: 0.4, fontSize: "medium" }} />}
            label={children}
            iconPosition="start"
            disableRipple
            onClick={handleClick}
            onContextMenu={activateContextMenu}
            sx={{
               minHeight: "48px",
               height: "48px",
               backgroundColor: isActive ? "#F4F7F9" : "#FEFEFE",
               borderTop: isActive ? "2px solid #4690E2" : "",
               fontSize: "14px",
               fontWeight: isActive ? 600 : 500,
               "&:hover": {
                  backgroundColor: "#F4F7F9",
                  opacity: 1,
               },
               flex: "1 1 auto",
               cursor: dragStarted ? "grabbing" : "pointer",
            }}
         />
         {isHovered && (
            <IconButton
               size="small"
               disableRipple
               onClick={(e) => {
                  e.stopPropagation()
                  onRemoveTab()
               }}
               sx={{
                  position: "absolute",
                  right: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  minWidth: "auto",
                  height: "48px",
                  width: "24px",
                  "&:hover": {
                     backgroundColor: "transparent",
                  },
               }}
            >
               <CancelIcon
                  fontSize="medium"
                  className="hover:text-main-red"
                  sx={{ marginBottom: 0.4, paddingLeft: 1 }}
               />
            </IconButton>
         )}
      </div>
   )
}
