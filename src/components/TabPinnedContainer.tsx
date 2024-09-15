import { forwardRef, ReactNode } from "react"

type TabPinnedContainerT = {
   children: ReactNode
}

const TabPinnedContainer = forwardRef<HTMLDivElement, TabPinnedContainerT>(
   ({ children }, ref) => {
      return (
         <div className="flex flex-1" ref={ref}>
            {children}
         </div>
      )
   }
)

export default TabPinnedContainer
