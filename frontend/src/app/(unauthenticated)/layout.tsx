
interface LayoutProps {
    children: React.ReactNode
}


export default function  Layout({ children }: LayoutProps) {
    return (
        <div className="max-w-screen-lg w-full h-full mx-auto p-4">
            { children }
        </div>
    )
}
