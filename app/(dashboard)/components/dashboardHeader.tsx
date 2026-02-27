import { Fragment } from 'react';
import { Toolbar, ToolbarHeading } from '@/app/components/layouts/demo1/components/toolbar';
import { Container } from '@/components/common/container';
// import { Demo1LightSidebarContent } from './';

export function DashboardHeader({ title, description }) {
  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading
            title={title}
            description={description}
          />
        </Toolbar>
      </Container>
    </Fragment>
  );
}