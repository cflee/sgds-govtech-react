import classNames from 'classnames';
import PropTypes from 'prop-types';

import * as React from 'react';
import { useMemo } from 'react';
import { InputGroupText } from './InputGroupText';
import {
  useBootstrapPrefix,
  SGDSWrapper,
} from '../ThemeProvider/ThemeProvider';
import FormCheckInput, { FormCheckInputProps } from '../Form/FormCheckInput';
import InputGroupContext from './InputGroupContext';
import { BsPrefixProps, BsPrefixRefForwardingComponent } from '../utils/helpers';



export const InputGroupCheckbox = (props: FormCheckInputProps) => (
  <InputGroupText>
    <FormCheckInput type="checkbox" {...props} />
  </InputGroupText>
);

export const InputGroupRadio = (props: FormCheckInputProps) => (
  <InputGroupText>
    <FormCheckInput type="radio" {...props} />
  </InputGroupText>
);

export interface InputGroupProps
  extends BsPrefixProps,
    React.HTMLAttributes<HTMLElement> {
  size?: 'sm' | 'md' | 'lg';
  hasValidation?: boolean;
  variant?: 'has-icon' | 'quantity-toggle'
}

const propTypes = {
  /** @default 'input-group' */
  bsPrefix: PropTypes.string,

  /**
   * Control the size of buttons and form elements from the top-level.
   *
   * @type {('sm'|'lg')}
   */
  size: PropTypes.string,

  /**
   * Handles the input's rounded corners when using form validation.
   *
   * Use this when your input group contains both an input and feedback element.
   */
  hasValidation: PropTypes.bool,

  as: PropTypes.elementType,
};

/**
 *
 * @property {InputGroupText} Text
 * @property {InputGroupRadio} Radio
 * @property {InputGroupCheckbox} Checkbox
 */
const InputGroup: BsPrefixRefForwardingComponent<'div', InputGroupProps> =
  React.forwardRef<HTMLElement, InputGroupProps>(
    (
      {
        bsPrefix,
        size = 'md',
        hasValidation,
        className,
        // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
        as: Component = 'div',
        ...InputGroupProps
      },
      ref
    ) => {
      bsPrefix = useBootstrapPrefix(bsPrefix, 'input-group');

      // Intentionally an empty object. Used in detecting if a dropdown
      // exists under an input group.
      const contextValue = useMemo(() => ({}), []);

      return (

          <InputGroupContext.Provider value={contextValue}>
            <SGDSWrapper as={Component}
              ref={ref}
              {...InputGroupProps}
              className={classNames(
                className,
                bsPrefix,
                size && `${bsPrefix}-${size}`,
                hasValidation && 'has-validation'
              )}
            />
          </InputGroupContext.Provider>
      );
    }
  );

InputGroup.propTypes = propTypes;
InputGroup.displayName = 'InputGroup';

export default Object.assign(InputGroup, {
  Text: InputGroupText,
  Radio: InputGroupRadio,
  Checkbox: InputGroupCheckbox,
});
