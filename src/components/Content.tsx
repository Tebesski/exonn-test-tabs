import { MusicNote, MusicOff } from "@mui/icons-material"
import { Button } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import music from "../../public/assets/i-dont-want-to-set-the-world-on-fire.mp3"
import { useTabContext } from "../context/TabContext"

export default function Content() {
   const { tabId } = useParams<{ tabId: string }>()
   const { persistentData } = useTabContext()
   const [musicState, setMusicState] = useState(false)
   const audioRef = useRef<HTMLAudioElement | null>(null)

   useEffect(() => {
      if (musicState) {
         play()
      } else {
         stop()
      }

      return () => {
         stop()
      }
   }, [musicState])

   const displayedTab = persistentData.find((tab) => tab.id === Number(tabId))

   function clearLocalStorage() {
      localStorage.clear()
   }

   function play() {
      if (!audioRef.current) {
         audioRef.current = new Audio(music)
      }
      audioRef.current.volume = 0.1
      audioRef.current.play()
   }

   function stop() {
      if (audioRef.current) {
         audioRef.current.pause()
         audioRef.current.currentTime = 0
      }
   }

   return (
      <section>
         <p>
            You are currently seeing: <b>{displayedTab?.name} tab</b>
         </p>
         <br></br>
         <div className="flex items-center">
            <div>
               <h2 style={{ color: "black", fontSize: "24px" }}>Tutorial:</h2>{" "}
               <ol className="list-decimal ml-8">
                  <li>To open pin/unpin and close menu: RMB on the tab</li>
                  <li>
                     To start moving a tab: hold tab for a slight of moment
                  </li>
                  <li>
                     To update the "database", clear the localStorage with the
                     button below
                  </li>
                  <li>
                     Play the music and wait till the World end...
                     -----------------------------------------------------------------------
                  </li>
               </ol>
               <Button
                  variant="contained"
                  disableElevation
                  sx={{ marginLeft: 2, marginTop: 2 }}
                  onClick={clearLocalStorage}
               >
                  Clear localStorage
               </Button>
            </div>

            <div
               onClick={() => setMusicState((prev) => !prev)}
               className="cursor-pointer"
            >
               {musicState ? (
                  <MusicNote sx={{ marginTop: 7, fontSize: "64px" }} />
               ) : (
                  <MusicOff sx={{ marginTop: 7, fontSize: "64px" }} />
               )}
            </div>
         </div>
      </section>
   )
}
