import { Divider } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { DataT, useTabContext } from "../context/TabContext"
import { TabsType } from "../types/TabsType.enum"
import { iconMap } from "../utilities/iconMap"
import TabDropdown from "./TabDropdown"
import TabElement from "./TabElement"
import TabOptionsMenu from "./TabOptionsMenu"
import TabPinnedContainer from "./TabPinnedContainer"
import TabPinnedElement from "./TabPinnedElement"

export default function TabContainer() {
   const { tabId } = useParams<{ tabId: string }>()
   const {
      activeTab,
      setActiveTab,
      persistentData,
      overflowTabs,
      visibleTabs,
      pinnedTabs,
      loading,
      setLoading,
      setOverflowTabs,
      setVisibleTabs,
      handleRemoveTab,
      setPinnedTabs,
   } = useTabContext()

   const [hoveredTab, setHoveredTab] = useState<number | null>(null)

   const containerRef = useRef<HTMLDivElement>(null)
   const dropdownRef = useRef<HTMLButtonElement>(null)
   const pinsContainerRef = useRef<HTMLDivElement>(null)
   const tabElementRef = useRef<HTMLDivElement>(null)

   useEffect(() => {
      const updateTabs = () => {
         if (persistentData.length) {
            const visible = persistentData.slice(0, 13)

            const overflow = persistentData.slice(13).map((tab) => tab)

            setPinnedTabs(persistentData.filter((tab) => tab.isPinned))
            setVisibleTabs(visible.filter((tab) => !tab.isPinned))
            setOverflowTabs(overflow.filter((tab) => !tab.isPinned))
            setLoading(false)
         }
      }

      updateTabs()
   }, [persistentData])

   useEffect(() => {
      if (tabId) {
         setActiveTab(Number(tabId))
      }
   }, [tabId, setActiveTab])

   const handleMouseEnter = (id: number) => setHoveredTab(id)
   const handleMouseLeave = () => setHoveredTab(null)

   const renderPinnedTabs = () => {
      return pinnedTabs.map(({ icon, name, id }, index, tabsData) => {
         const Icon = iconMap[icon]
         const dividerVisibility =
            hoveredTab === id ||
            hoveredTab === tabsData[index + 1]?.id ||
            activeTab === id ||
            activeTab === tabsData[index + 1]?.id

         return (
            <div
               onMouseEnter={() => handleMouseEnter(id)}
               onMouseLeave={handleMouseLeave}
               key={id}
               className="flex"
            >
               <TabPinnedElement
                  Icon={Icon}
                  tabId={id}
                  handleTabActivate={setActiveTab}
                  isActive={activeTab === id}
                  id={`tab-${id}`}
                  onRemoveTab={() => handleRemoveTab(id, TabsType.PINNED)}
               />
               {index < tabsData.length - 1 && (
                  <Divider
                     orientation="vertical"
                     style={{
                        height: 15,
                        alignSelf: "center",
                        visibility: dividerVisibility ? "hidden" : "visible",
                     }}
                     className="text-light-gray"
                  />
               )}
            </div>
         )
      })
   }

   const renderTabs = (tabsData: DataT[]) => {
      return tabsData.map(({ icon, name, id }, index) => {
         const Icon = iconMap[icon]
         const dividerVisibility =
            hoveredTab === id ||
            hoveredTab === tabsData[index + 1]?.id ||
            activeTab === id ||
            activeTab === tabsData[index + 1]?.id

         return (
            <div
               onMouseEnter={() => handleMouseEnter(id)}
               onMouseLeave={handleMouseLeave}
               key={id}
               style={{
                  flex: overflowTabs.length > 0 ? "1 1 auto" : "0 1 auto",
                  minWidth: "max-content",
               }}
               className="flex"
            >
               <TabElement
                  Icon={Icon}
                  tabId={id}
                  handleTabActivate={setActiveTab}
                  isActive={activeTab === id}
                  id={`tab-${id}`}
                  onRemoveTab={() => handleRemoveTab(id)}
                  hoveredTab={hoveredTab}
               >
                  {name}
               </TabElement>
               {index < tabsData.length - 1 && (
                  <Divider
                     orientation="vertical"
                     style={{
                        height: 15,
                        alignSelf: "center",
                        visibility: dividerVisibility ? "hidden" : "visible",
                     }}
                     className="text-light-gray"
                  />
               )}
            </div>
         )
      })
   }

   return (
      <>
         <div className="flex w-full" ref={containerRef}>
            {pinnedTabs.length > 0 && (
               <TabPinnedContainer ref={pinsContainerRef}>
                  {renderPinnedTabs()}
               </TabPinnedContainer>
            )}

            {loading ? null : (
               <div
                  id="tab-container"
                  className="flex w-full"
                  ref={tabElementRef}
               >
                  {visibleTabs.length > 0
                     ? renderTabs(visibleTabs)
                     : renderTabs(persistentData)}
               </div>
            )}

            <TabDropdown ref={dropdownRef} overflowTabs={overflowTabs} />
         </div>

         <TabOptionsMenu />
      </>
   )
}
