import { Button } from "@/components/ui/button"
import { DialogTrigger } from "@radix-ui/react-dialog"
import { GroupModal } from "./group-modal"

export const CreateGroupBtn = () => {
    return (
        <GroupModal>
            <DialogTrigger asChild>
                <Button>Create</Button>
            </DialogTrigger>
        </GroupModal>
    )
}  