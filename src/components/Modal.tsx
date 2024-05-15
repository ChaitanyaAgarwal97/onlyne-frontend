import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function Modal({ children, title, form }: { children?: React.ReactNode, title: string, form: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary">{children}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:h-[90%] bg-[hsl(287,60%,95%)] dark:bg-[hsl(287,60%,5%)]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {form}
      </DialogContent>
    </Dialog>
  )
}
