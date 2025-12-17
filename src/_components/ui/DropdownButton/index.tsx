import { Button, Popover, Portal } from "@chakra-ui/react"
import { ReactNode } from "react"


export const DropdownButton = ({ buttonText, children }: {buttonText?: string, children?: ReactNode  }) => {
  return (
    <Popover.Root positioning={{ placement: "bottom-end" }}>
      <Popover.Trigger asChild>
        <Button size="sm" variant="outline">
          { buttonText ?? "Ações"}
        </Button>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content zIndex={0}>
            <Popover.Arrow />
            <Popover.Body>
                {children}
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  )
}
