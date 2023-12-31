import { cn } from '@/utils/style';
import { ComponentPropsWithoutRef, ElementType, createElement } from 'react';
import { IconType } from 'react-icons';

type IconButtonProps<Component extends ElementType> =
  ComponentPropsWithoutRef<Component> & {
    component?: Component;
    className?: string;
    iconClassName?: string;
    Icon: IconType;
  };

const IconButton = <Component extends ElementType = 'button'>({
  Icon,
  component,
  className,
  iconClassName,
  ...props
}: IconButtonProps<Component>) =>
  createElement(
    component ?? 'button',
    {
      className: cn('p-1.5 lg:p-2', className),
      ...props,
    },
    <Icon
      className={cn('h-5 w-5 transition-all lg:h-6 lg:w-6', iconClassName)}
    />
  );

export default IconButton;
