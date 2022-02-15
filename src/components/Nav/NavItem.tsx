// import createWithBsPrefix from '../createWithBsPrefix';

// export default createWithBsPrefix('nav-item');

import classNames from 'classnames';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useBootstrapPrefix } from '../ThemeProvider/ThemeProvider';
import { BsPrefixRefForwardingComponent, BsPrefixProps } from '../helpers';

export interface NavItemProps
  extends BsPrefixProps,
    React.HTMLAttributes<HTMLElement> {
        hoverable? : boolean;
}

const propTypes = {
  /** Set a custom element for this component */
  as: PropTypes.elementType,

  /** @default 'accordion-item' */
  bsPrefix: PropTypes.string,
  hoverable: PropTypes.bool
};

const NavItem: BsPrefixRefForwardingComponent<'li', NavItemProps> =
  React.forwardRef<HTMLElement, NavItemProps>(
    (
      {
        // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
        as: Component = 'li',
        bsPrefix,
        className,
        hoverable,
        children,
        ...props
      },
      ref,
    ) => {
      bsPrefix = useBootstrapPrefix(bsPrefix, 'nav-item');

      return (
          <Component
            ref={ref}
            {...props}
            className={classNames(className, bsPrefix)}
          >
              {children}
              {hoverable && <i className="bi bi-chevron-down"></i>}
          </Component>
      );
    },
  );

NavItem.propTypes = propTypes;
NavItem.displayName = 'NavItem';

export default NavItem;
