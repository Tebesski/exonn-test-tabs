import {
   closestCenter,
   DndContext,
   DragEndEvent,
   KeyboardSensor,
   PointerSensor,
   TouchSensor,
   useDroppable,
   useSensor,
   useSensors,
} from "@dnd-kit/core"
import {
   restrictToHorizontalAxis,
   restrictToWindowEdges,
} from "@dnd-kit/modifiers"
import {
   arrayMove,
   horizontalListSortingStrategy,
   SortableContext,
   sortableKeyboardCoordinates,
} from "@dnd-kit/sortable"
import { Divider } from "@mui/material"
import { useEffect, useState } from "react"
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
      setPersistentData,
   } = useTabContext()

   const { setNodeRef } = useDroppable({
      id: "droppable",
   })

   const sensors = useSensors(
      useSensor(PointerSensor, {
         activationConstraint: {
            delay: 150,
            tolerance: 5,
         },
      }),
      useSensor(TouchSensor, {
         activationConstraint: {
            delay: 2000,
            tolerance: 5,
         },
      }),
      useSensor(KeyboardSensor, {
         coordinateGetter: sortableKeyboardCoordinates,
      })
   )

   const [hoveredTab, setHoveredTab] = useState<number | null>(null)
   const [dragStarted, setDragStarted] = useState<boolean>(false)

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

   function handleDragStart() {
      setDragStarted(true)
   }

   function handleDragEnd(event: DragEndEvent) {
      setDragStarted(false)
      const { active, over } = event

      if (over && active.id !== over.id) {
         setVisibleTabs((items) => {
            const oldIndex = items.findIndex((item) => item.id === active.id)
            const newIndex = items.findIndex((item) => item.id === over.id)

            if (oldIndex !== -1 && newIndex !== -1) {
               const newVisibleTabs = arrayMove(items, oldIndex, newIndex)

               const sortedPersistentData = [
                  ...pinnedTabs,
                  ...newVisibleTabs,
                  ...overflowTabs,
               ].map((tab) => {
                  return persistentData.find((p) => p.id === tab.id) || tab
               })

               setPersistentData(sortedPersistentData)

               const maxVisibleTabs = 13
               const newOverflowTabs =
                  sortedPersistentData.slice(maxVisibleTabs)
               const updatedVisibleTabs = sortedPersistentData
                  .slice(0, maxVisibleTabs)
                  .filter((tab) => !tab.isPinned)

               setVisibleTabs(updatedVisibleTabs)
               setOverflowTabs(newOverflowTabs)

               return updatedVisibleTabs
            }

            return items
         })
      }
   }

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
                  dragStarted={dragStarted}
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
      <DndContext
         sensors={sensors}
         collisionDetection={closestCenter}
         onDragEnd={handleDragEnd}
         onDragStart={handleDragStart}
         modifiers={[restrictToWindowEdges, restrictToHorizontalAxis]}
      >
         <div className="flex w-full" ref={setNodeRef}>
            {pinnedTabs.length > 0 && (
               <TabPinnedContainer>{renderPinnedTabs()}</TabPinnedContainer>
            )}
            <SortableContext
               items={visibleTabs.map((tab) => tab.id)}
               strategy={horizontalListSortingStrategy}
            >
               {loading ? null : (
                  <div id="tab-container" className="flex w-full">
                     {visibleTabs.length > 0
                        ? renderTabs(visibleTabs)
                        : renderTabs(persistentData)}
                  </div>
               )}
            </SortableContext>

            <TabDropdown overflowTabs={overflowTabs} />
         </div>

         <TabOptionsMenu />
      </DndContext>
   )
}
