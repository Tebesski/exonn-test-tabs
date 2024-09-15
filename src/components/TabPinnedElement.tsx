import { SvgIconComponent } from "@mui/icons-material"
import { IconButton } from "@mui/material"
import { MouseEvent } from "react"
import { useTabContext } from "../context/TabContext"
import { TabsType } from "../types/TabsType.enum"

type TabElementT = {
   Icon: SvgIconComponent
   tabId: number
   isActive: boolean
   handleTabActivate: React.Dispatch<React.SetStateAction<number | null>>
   id: string
   onRemoveTab: (tabId: number) => void
}

export default function TabPinnedElement({
   Icon,
   tabId,
   isActive,
   handleTabActivate,
   id,
}: TabElementT) {
   const { navigateToTab, handleOpenContextMenu, setContextMenuType } =
      useTabContext()

   function handleClick() {
      navigateToTab(tabId)
      handleTabActivate(tabId)
   }

   function activateContextMenu(e: MouseEvent) {
      setContextMenuType(TabsType.PINNED)
      handleOpenContextMenu(e, tabId)
   }

   return (
      <div
         id={id}
         style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
         }}
      >
         <IconButton
            onClick={handleClick}
            onContextMenu={activateContextMenu}
            sx={{
               minHeight: "48px",
               height: "48px",
               backgroundColor: isActive ? "#F4F7F9" : "#FEFEFE",
               fontSize: "14px",
               fontWeight: isActive ? 600 : 500,
               display: "flex",
               alignItems: "center",
               "&:hover": {
                  backgroundColor: "#F4F7F9",
                  opacity: 1,
               },
               borderTop: isActive ? "2px solid #4690E2" : "",
               padding: 0,
               maxWidth: 48,
               minWidth: 48,
               borderRadius: 0,
            }}
         >
            <Icon
               sx={{
                  marginBottom: 0.4,
                  fontSize: "medium",
               }}
            />
         </IconButton>
      </div>
   )
}
