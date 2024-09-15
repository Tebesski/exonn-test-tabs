import CancelIcon from "@mui/icons-material/Cancel"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import {
   Divider,
   IconButton,
   ListItemIcon,
   ListItemText,
   Menu,
   MenuItem,
} from "@mui/material"
import { forwardRef, MouseEvent, useState } from "react"
import { DataT, useTabContext } from "../context/TabContext"
import { TabsType } from "../types/TabsType.enum"
import { iconMap } from "../utilities/iconMap"

interface TabDropdownProps {
   overflowTabs: DataT[]
}

const TabDropdown = forwardRef<HTMLButtonElement, TabDropdownProps>(
   ({ overflowTabs }, ref) => {
      const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
      const open = Boolean(anchorEl)
      const {
         navigateToTab,
         persistentData,
         handleRemoveTab,
         setContextMenuType,
         handleOpenContextMenu,
      } = useTabContext()

      const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
         setAnchorEl(anchorEl ? null : event.currentTarget)
      }

      const handleClose = () => {
         setAnchorEl(null)
      }

      const handleTabClick = (tabId: number) => {
         navigateToTab(tabId)
         handleClose()
      }

      function activateContextMenu(e: MouseEvent, tabId: number) {
         setContextMenuType(TabsType.OVERFLOW)
         handleOpenContextMenu(e, tabId)
      }

      const isDisabled = overflowTabs.length < 1

      return (
         <div>
            <IconButton
               disabled={isDisabled}
               ref={ref}
               onClick={handleClick}
               disableRipple
               sx={{
                  boxShadow: "none",
                  ".MuiButton-root": { textTransform: "none" },
                  height: "48px",
                  borderRadius: 0,
                  backgroundColor: open ? "#4690E2" : "",
                  color: open ? "#FEFEFE" : "",
                  maxWidth: "36px",
                  minWidth: "36px",
                  flex: "1 1 0",
               }}
            >
               {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>

            <Menu
               anchorEl={anchorEl}
               open={open}
               onClose={handleClose}
               slotProps={{
                  paper: {
                     style: {
                        maxHeight: 48 * 4.9,
                        width: "225px",
                        borderRadius: 0,
                        marginLeft: 14,
                     },
                  },
               }}
            >
               {overflowTabs.map(({ id }, index) => {
                  const tab = persistentData.find(
                     (tab) => tab.id === Number(id)
                  )

                  const Icon = tab ? iconMap[tab.icon] : null

                  return (
                     <div key={id}>
                        <MenuItem
                           onClick={() => {
                              handleTabClick(id)
                           }}
                           disableRipple
                           onContextMenu={(e) => activateContextMenu(e, id)}
                        >
                           <ListItemIcon>
                              {Icon && (
                                 <Icon
                                    sx={{
                                       marginBottom: 0.4,
                                       fontSize: "medium",
                                    }}
                                 />
                              )}
                           </ListItemIcon>{" "}
                           <ListItemText primary={tab?.name} />
                           <ListItemIcon
                              onClick={(e) => {
                                 e.stopPropagation()
                                 handleRemoveTab(id, TabsType.OVERFLOW)
                              }}
                           >
                              <CancelIcon
                                 fontSize="small"
                                 className="hover:text-main-red"
                              />
                           </ListItemIcon>
                        </MenuItem>
                        {index < overflowTabs.length - 1 && <Divider />}{" "}
                     </div>
                  )
               })}
            </Menu>
         </div>
      )
   }
)

export default TabDropdown
