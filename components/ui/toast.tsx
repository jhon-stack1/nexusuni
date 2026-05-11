

'use client'

import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'

import { cn } from '@/lib/utils'

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn('flex flex-col gap-2', className)}

      'use client'
      
      import * as React from 'react'
      import * as SliderPrimitive from '@radix-ui/react-slider'
      
      import { cn } from '@/lib/utils'
      
      function Slider({
        className,
        defaultValue,
        value,
        min = 0,
        max = 100,
        ...props
      }: React.ComponentProps<typeof SliderPrimitive.Root>) {
        const _values = React.useMemo(
          () =>
            Array.isArray(value)
              ? value
              : Array.isArray(defaultValue)
                ? defaultValue
                : [min, max],
          [value, defaultValue, min, max],
        )
      
        return (
          <SliderPrimitive.Root
            data-slot="slider"
            defaultValue={defaultValue}
            value={value}
            min={min}
            max={max}
            className={cn(
              'relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
              className,
            )}
            {...props}
          >
            <SliderPrimitive.Track
              data-slot="slider-track"
              className="bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
            >
              <SliderPrimitive.Range
                data-slot="slider-range"
                className="bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
              />
            </SliderPrimitive.Track>
            {Array.from({ length: _values.length }, (_, index) => (
              <SliderPrimitive.Thumb
                data-slot="slider-thumb"
                key={index}
                className="border-primary ring-ring/50 block size-4 shrink-0 rounded-full border bg-white shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
              />
            ))}
          </SliderPrimitive.Root>
        )
      }
      
      export { Slider }
      'use client'
      
      import { useTheme } from 'next-themes'
      import { Toaster as Sonner, ToasterProps } from 'sonner'
      
      const Toaster = ({ ...props }: ToasterProps) => {
        const { theme = 'system' } = useTheme()
      
        return (
          <Sonner
            theme={theme as ToasterProps['theme']}
            className="toaster group"
            style={
              {
                '--normal-bg': 'var(--popover)',
                '--normal-text': 'var(--popover-foreground)',
                '--normal-border': 'var(--border)',
              } as React.CSSProperties
            }
            {...props}
          />
        )
      }
      
      export { Toaster }
      
      import { Loader2Icon } from 'lucide-react'
      
      import { cn } from '@/lib/utils'
      
      function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
        return (
          <Loader2Icon
            role="status"
            aria-label="Loading"
            className={cn('size-4 animate-spin', className)}
            {...props}
          />
        )
      }
      
      export { Spinner }
      
      'use client'
      
      import * as React from 'react'
      import * as SwitchPrimitive from '@radix-ui/react-switch'
      
      import { cn } from '@/lib/utils'
      
      function Switch({
        className,
        ...props
      }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
        return (
          <SwitchPrimitive.Root
            data-slot="switch"
            className={cn(
              'peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
              className,
            )}
            {...props}
          >
            <SwitchPrimitive.Thumb
              data-slot="switch-thumb"
              className="bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
            />
          </SwitchPrimitive.Root>
        )
      }
      
      export { Switch }
      
      'use client'
      
      import * as React from 'react'
      
      import { cn } from '@/lib/utils'
      
      function Table({ className, ...props }: React.ComponentProps<'table'>) {
        return (
          <div
            data-slot="table-container"
            className="relative w-full overflow-x-auto"
          >
            <table
              data-slot="table"
              className={cn('w-full caption-bottom text-sm', className)}
              {...props}
            />
          </div>
        )
      }
      
      function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
        return (
          <thead
            data-slot="table-header"
            className={cn('[&_tr]:border-b', className)}
            {...props}
          />
        )
      }
      
      function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
        return (
          <tbody
            data-slot="table-body"
            className={cn('[&_tr:last-child]:border-0', className)}
            {...props}
          />
        )
      }
      
      function TableFooter({ className, ...props }: React.ComponentProps<'tfoot'>) {
        return (
          <tfoot
            data-slot="table-footer"
            className={cn(
              'bg-muted/50 border-t font-medium [&>tr]:last:border-b-0',
              className,
            )}
            {...props}
          />
        )
      }
      
      function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
        return (
          <tr
            data-slot="table-row"
            className={cn(
              'hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors',
              className,
            )}
            {...props}
          />
        )
      }
      
      function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
        return (
          <th
            data-slot="table-head"
            className={cn(
              'text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
              className,
            )}
            {...props}
          />
        )
      }
      
      function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
        return (
          <td
            data-slot="table-cell"
            className={cn(
              'p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
              className,
            )}
            {...props}
          />
        )
      }
      
      function TableCaption({
        className,
        ...props
      }: React.ComponentProps<'caption'>) {
        return (
          <caption
            data-slot="table-caption"
            className={cn('text-muted-foreground mt-4 text-sm', className)}
            {...props}
          />
        )
      }
      
      export {
        Table,
        TableHeader,
        TableBody,
        TableFooter,
        TableHead,
        TableRow,
        TableCell,
        TableCaption,
      }
      
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        'bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]',
        className,
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn('flex-1 outline-none', className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
import * as React from 'react'

import { cn } from '@/lib/utils'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
'use client'

import * as React from 'react'
import * as ToastPrimitives from '@radix-ui/react-toast'
import { cva, type VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'

import { cn } from '@/lib/utils'

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
      className,
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full',
  {
    variants: {
      variant: {
        default: 'border bg-background text-foreground',
        destructive:
          'destructive group border-destructive bg-destructive text-destructive-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive',
      className,
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      'absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600',
      className,
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn('text-sm font-semibold', className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn('text-sm opacity-90', className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
