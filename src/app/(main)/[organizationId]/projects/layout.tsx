import ProjectSideNavBar from "@/app/components/projects/ProjectSideNavBar";

export default function ProjectsLayout({ children, params }: { children: ReactNode, params: { organizationId: string } }) {
    return (
        <div className="h-full md:flex">
            <div className="w-fit h-full hidden md:block">
                {/* <ProjectSideNavBar organizationId={params.organizationId} /> */}
            </div>
            {children}
        </div>
    );
}