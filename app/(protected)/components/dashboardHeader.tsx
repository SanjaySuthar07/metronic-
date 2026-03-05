import { Toolbar, ToolbarHeading } from '@/app/components/layouts/demo1/components/toolbar';
interface ToolbarHeadingProps {
  title?: string;
  description?: string;
}
export function DashboardHeader({ title, description }: ToolbarHeadingProps) {
  return (
    <Toolbar >
      <ToolbarHeading
        title={title}
        description={description}
      />
    </Toolbar >
  );
}