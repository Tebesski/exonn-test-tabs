import { ReactNode } from "react"

export default function ContentBox({ children }: { children: ReactNode }) {
   return <div className="bg-white h-full mx-5 my-5 relative">{children}</div>
}
