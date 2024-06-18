import { Input } from "@/components/ui/input";

export const ImageUploadCompact = ({ formRef }: { formRef: any}) => {
    return (
        <Input {...formRef} placeholder="Upload image" type="file" accept="image/png, image/jpeg, image/gif"/>
    )
};