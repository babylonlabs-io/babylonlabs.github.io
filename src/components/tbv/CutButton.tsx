import React from 'react';
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from 'react';

/**
 * Chamfered button. Two corners are cut away, which is the signature shape of
 * the launch design. The cut is a clip-path driven by a --cut CSS variable so
 * the same class works at any size.
 */

const CUT =
  '[clip-path:polygon(var(--cut)_0,100%_0,100%_calc(100%-var(--cut)),calc(100%-var(--cut))_100%,0_100%,0_var(--cut))]';

const BASE =
  'inline-flex items-center justify-center gap-2 text-sm font-medium tracking-wide transition-colors duration-200 focus-ring no-underline';

type Variant = 'solid' | 'outline' | 'accent';

type BaseProps = {
  variant?: Variant;
  fullWidth?: boolean;
  cut?: number;
  className?: string;
  children: ReactNode;
};

type ButtonProps = BaseProps &
  Omit<ComponentPropsWithoutRef<'button'>, 'className' | 'children'> & {
    href?: undefined;
  };

type AnchorProps = BaseProps &
  Omit<ComponentPropsWithoutRef<'a'>, 'className' | 'children'> & {
    href: string;
  };

export type CutButtonProps = ButtonProps | AnchorProps;

const SURFACE: Record<Variant, string> = {
  solid: 'bg-foreground text-background hover:bg-foreground/85',
  accent: 'bg-accent text-accent-foreground hover:bg-accent/85',
  outline: 'bg-background text-foreground hover:bg-muted',
};

export function CutButton({
  variant = 'solid',
  fullWidth = false,
  cut = 9,
  className = '',
  children,
  ...props
}: CutButtonProps): JSX.Element {
  const cutVar = { '--cut': `${cut}px` } as CSSProperties;
  const isAnchor = 'href' in props && props.href !== undefined;
  const width = fullWidth ? 'w-full' : '';

  // The outline variant draws its border as a 1px parent behind the clipped
  // child. A plain border would be sliced off by the clip-path.
  if (variant === 'outline') {
    const wrapper = `inline-flex h-10 ${width} bg-border p-px ${CUT} ${className}`;
    const inner = `${BASE} h-full px-5 ${width} ${CUT} ${SURFACE.outline}`;

    if (isAnchor) {
      const { href, ...rest } = props as AnchorProps;
      return (
        <span style={cutVar} className={wrapper}>
          <a href={href} style={cutVar} className={inner} {...rest}>
            {children}
          </a>
        </span>
      );
    }
    return (
      <span style={cutVar} className={wrapper}>
        <button style={cutVar} className={inner} {...(props as ButtonProps)}>
          {children}
        </button>
      </span>
    );
  }

  const cls = `${BASE} h-10 px-5 ${width} ${CUT} ${SURFACE[variant]} ${className}`;

  if (isAnchor) {
    const { href, ...rest } = props as AnchorProps;
    return (
      <a href={href} style={cutVar} className={cls} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <button style={cutVar} className={cls} {...(props as ButtonProps)}>
      {children}
    </button>
  );
}

export default CutButton;
