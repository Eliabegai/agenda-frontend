import { ReactNode } from 'react'
import { Tooltip as TooltipComponent, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'

interface TooltipProps {
  children: ReactNode
  text: string
}

const Tooltip = ({children, text}: TooltipProps) => {

  return(
    <TooltipProvider>
      <TooltipComponent>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <div>{text}</div>
        </TooltipContent>
      </TooltipComponent>
    </TooltipProvider>
  )

}

export default Tooltip