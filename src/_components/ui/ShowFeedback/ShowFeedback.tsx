import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react"


export const ShowFeedback = ({open, setOpen, feedback}:{feedback: string, open: boolean, setOpen:(e: boolean) => void; }) => {
  
  return (
    <Dialog.Root size="lg" lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Feedback da candidatura</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
                {feedback}
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Fechar</Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
