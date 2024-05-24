import { Button } from "@/app/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog"

export function Modal({ children, title, form, trigger, contentClasses }: { children?: React.ReactNode, title: string, form: React.ReactNode, trigger?: React.ReactNode, contentClasses?: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {!trigger ? <Button variant="primary">{children}</Button> : trigger}
      </DialogTrigger>
      <DialogContent className={`sm:max-w-[425px] bg-[hsl(287,60%,85%)] dark:bg-[hsl(287,60%,5%)] ${contentClasses}`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {form}
      </DialogContent>
    </Dialog >
  )
}
