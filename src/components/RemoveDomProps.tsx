export default function RemoveDomProps({ style, className, children }: any) {
   return (
      <div style={style} className={className}>
         {children}
      </div>
   )
}
