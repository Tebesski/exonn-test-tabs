import {
   createContext,
   MouseEvent,
   ReactNode,
   useContext,
   useState,
} from "react"
import { useNavigate } from "react-router-dom"
import data from "../data/tabs.json"
import usePersistantState from "../hooks/usePersistantState"
import { TabsType } from "../types/TabsType.enum"

export type DataT = {
   name: string
   icon: string
   id: number
   isPinned: boolean
}

type TabContextT = {
   activeTab: number | null
   setActiveTab: React.Dispatch<React.SetStateAction<number | null>>

   persistentData: DataT[]
   setPersistentData: (value: DataT[]) => void

   navigateToTab: (tabId: number) => void

   overflowTabs: DataT[]
   setOverflowTabs: React.Dispatch<React.SetStateAction<DataT[]>>

   visibleTabs: DataT[]
   setVisibleTabs: React.Dispatch<React.SetStateAction<DataT[]>>

   pinnedTabs: DataT[]
   setPinnedTabs: React.Dispatch<React.SetStateAction<DataT[]>>

   handleOpenContextMenu: (e: MouseEvent, tabId: number) => void

   anchorEl: HTMLElement | null
   setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>

   loading: boolean
   setLoading: React.Dispatch<React.SetStateAction<boolean>>

   handleRemoveTab: (tabId: number, removeMode?: TabsType) => void
   contextTabId: number | undefined

   contextMenuType: TabsType
   setContextMenuType: React.Dispatch<React.SetStateAction<TabsType>>
}

const TabContext = createContext<TabContextT | undefined>(undefined)

export function useTabContext() {
   const context = useContext(TabContext)

   if (!context) {
      throw new Error("useTabContext must be used within a TabProvider")
   }

   return context
}

export function TabProvider({ children }: { children: ReactNode }) {
   const navigate = useNavigate()

   const [persistentData, setPersistentData] = usePersistantState<DataT[]>(
      "tabs",
      data
   )

   const [loading, setLoading] = useState(true)

   const [overflowTabs, setOverflowTabs] = useState<DataT[]>([])
   const [visibleTabs, setVisibleTabs] = useState<DataT[]>([])
   const [pinnedTabs, setPinnedTabs] = useState<DataT[]>([])

   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
   const [activeTab, setActiveTab] = useState<number | null>(null)
   const [contextTabId, setContextTabId] = useState<number>()
   const [contextMenuType, setContextMenuType] = useState<TabsType>(
      TabsType.VISIBLE
   )

   function navigateToTab(tabId: number) {
      navigate(`/main/tabs/${tabId}`, { replace: true })
   }

   function handleOpenContextMenu(e: MouseEvent, tabId: number) {
      e.preventDefault()
      setAnchorEl(e.currentTarget as HTMLButtonElement)
      setContextTabId(tabId)
   }

   function handleRemoveTab(tabId: number) {
      const updatedPersistentData = persistentData.filter(
         (tab) => tab.id !== tabId
      )
      setPersistentData(updatedPersistentData)

      if (activeTab === tabId) {
         const newActiveTab = updatedPersistentData[0]?.id ?? null
         setActiveTab(newActiveTab)
         navigateToTab(newActiveTab)
      }
   }

   return (
      <TabContext.Provider
         value={{
            activeTab,
            setActiveTab,
            persistentData,
            setPersistentData,
            navigateToTab,
            overflowTabs,
            setOverflowTabs,
            visibleTabs,
            setVisibleTabs,
            setPinnedTabs,
            pinnedTabs,
            handleOpenContextMenu,
            setAnchorEl,
            anchorEl,
            loading,
            setLoading,
            handleRemoveTab,
            contextTabId,
            contextMenuType,
            setContextMenuType,
         }}
      >
         {children}
      </TabContext.Provider>
   )
}
