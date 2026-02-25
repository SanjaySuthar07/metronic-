'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

// Define CardContext
type CardContextType = {
  variant: 'default' | 'accent';
};

const CardContext = React.createContext<CardContextType>({
  variant: 'default',
});

const useCardContext = () => {
  const context = React.useContext(CardContext);
  if (!context) {
    throw new Error('useCardContext must be used within a Card component');
  }
  return context;
};

// Variants
const cardVariants = cva(
  'flex flex-col items-stretch text-card-foreground rounded-xl',
  {
    variants: {
      variant: {
        default: 'bg-card border border-border shadow-xs black/5',
        accent: 'bg-muted shadow-xs p-1',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const cardHeaderVariants = cva(
  'flex items-center justify-between flex-wrap px-5 min-h-14 gap-2.5',
  {
    variants: {
      variant: {
        default: 'border-b border-border',
        accent: '',
      },
    },
  }
);

const cardContentVariants = cva('grow p-5', {
  variants: {
    variant: {
      default: '',
      accent: 'bg-card rounded-t-xl [&:last-child]:rounded-b-xl',
    },
  },
});

const cardTableVariants = cva('grid grow', {
  variants: {
    variant: {
      default: '',
      accent: 'bg-card rounded-xl',
    },
  },
});

const cardFooterVariants = cva('flex items-center px-5 min-h-14', {
  variants: {
    variant: {
      default: 'border-t border-border',
      accent: 'bg-card rounded-b-xl mt-[2px]',
    },
  },
});

// Card Component
function Card({
  className = '',
  variant = 'default',
  ...props
}: React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardVariants>) {
  return (
    <CardContext.Provider value={{ variant }}>
      <div
        data-slot="card"
        className={`${cardVariants({ variant })} ${className}`}
        {...props}
      />
    </CardContext.Provider>
  );
}

function CardHeader({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { variant } = useCardContext();
  return (
    <div
      data-slot="card-header"
      className={`${cardHeaderVariants({ variant })} ${className}`}
      {...props}
    />
  );
}

function CardContent({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { variant } = useCardContext();
  return (
    <div
      data-slot="card-content"
      className={`${cardContentVariants({ variant })} ${className}`}
      {...props}
    />
  );
}

function CardTable({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { variant } = useCardContext();
  return (
    <div
      data-slot="card-table"
      className={`${cardTableVariants({ variant })} ${className}`}
      {...props}
    />
  );
}

function CardFooter({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { variant } = useCardContext();
  return (
    <div
      data-slot="card-footer"
      className={`${cardFooterVariants({ variant })} ${className}`}
      {...props}
    />
  );
}

function CardHeading({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-heading"
      className={`space-y-1 ${className}`}
      {...props}
    />
  );
}

function CardToolbar({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-toolbar"
      className={`flex items-center gap-2.5 ${className}`}
      {...props}
    />
  );
}

function CardTitle({ className = '', ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      data-slot="card-title"
      className={`text-base font-semibold leading-none tracking-tight ${className}`}
      {...props}
    />
  );
}

function CardDescription({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="card-description"
      className={`text-sm text-muted-foreground ${className}`}
      {...props}
    />
  );
}

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardHeading,
  CardTable,
  CardTitle,
  CardToolbar,
};