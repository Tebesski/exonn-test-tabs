import { PushPin } from "@mui/icons-material"
import Delete from "@mui/icons-material/Delete"
import { Fade, Menu, MenuItem } from "@mui/material"
import { DataT, useTabContext } from "../context/TabContext"
import { TabsType } from "../types/TabsType.enum"

export default function TabOptionsMenu() {
   const {
      anchorEl,
      setAnchorEl,
      handleRemoveTab,
      contextTabId,
      visibleTabs,
      setPersistentData,
      persistentData,
      contextMenuType,
      pinnedTabs,
      overflowTabs,
   } = useTabContext()

   const open = Boolean(anchorEl)

   const handleClose = () => {
      setAnchorEl(null)
   }

   function handleDelete() {
      if (contextTabId) {
         handleClose()
         handleRemoveTab(contextTabId)
      }
   }

   function handlePin() {
      if (contextTabId) {
         handleClose()

         const tabToHandle = (tabs: DataT[]) =>
            tabs.find((tab) => {
               return tab.id === contextTabId
            })

         if (tabToHandle(visibleTabs) && contextMenuType === TabsType.VISIBLE) {
            const updatedPersistentData = persistentData.map((tab) =>
               tab.id === contextTabId ? { ...tab, isPinned: true } : tab
            )

            setPersistentData(updatedPersistentData)
         } else if (
            tabToHandle(pinnedTabs) &&
            contextMenuType === TabsType.PINNED
         ) {
            const updatedPersistentData = persistentData.map((tab) =>
               tab.id === contextTabId ? { ...tab, isPinned: false } : tab
            )

            setPersistentData(updatedPersistentData)
         } else if (
            tabToHandle(overflowTabs) &&
            contextMenuType === TabsType.OVERFLOW
         ) {
            const updatedPersistentData = persistentData.map((tab) =>
               tab.id === contextTabId ? { ...tab, isPinned: true } : tab
            )

            setPersistentData(updatedPersistentData)
         }
      }
   }

   return (
      <Menu
         id="fade-menu"
         MenuListProps={{
            "aria-labelledby": "fade-button",
         }}
         anchorEl={anchorEl}
         open={open}
         onClose={handleClose}
         onContextMenu={(e) => {
            e.preventDefault()
            handleClose()
         }}
         TransitionComponent={Fade}
         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
         transformOrigin={{ vertical: "top", horizontal: "center" }}
         elevation={0}
         sx={{
            "& .MuiPaper-root": {
               backgroundColor: "rgba(65, 66, 76, 0.6)",
               opacity: 0.1,
            },
         }}
      >
         <MenuItem onClick={handlePin} className="flex hover:text-white">
            {contextMenuType !== TabsType.PINNED ? (
               <PushPin fontSize="small" />
            ) : (
               <PushPin
                  fontSize="small"
                  sx={{ transform: "rotate(180deg)", marginBottom: 1 }}
               />
            )}
            {contextMenuType !== TabsType.PINNED ? "Pin" : "Unpin"}
         </MenuItem>
         <MenuItem onClick={handleDelete} className="flex hover:text-white">
            <Delete
               fontSize="small"
               sx={{
                  marginBottom: "0.25rem",
               }}
            />
            Delete
         </MenuItem>
      </Menu>
   )
}
