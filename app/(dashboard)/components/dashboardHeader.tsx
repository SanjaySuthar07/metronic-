import { Toolbar, ToolbarHeading } from '@/app/components/layouts/demo1/components/toolbar';

export function DashboardHeader({ title, description }) {
  return (
    <Toolbar >
      <ToolbarHeading
        title={title}
        description={description}
      />
    </Toolbar >
  );
}