import * as React from 'react';
import FormCheck, { FormCheckType } from '../Form/FormCheck';
import Card from './Card';
import { CardProps } from '..';
import PropTypes from 'prop-types';

type CardFormCheckProps = React.InputHTMLAttributes<HTMLInputElement> &
  Omit<CardProps, 'variant'>;

export interface SelectableCardProps extends CardFormCheckProps {
  /** Disables the FormCheck control when true */
  disabled?: boolean;
  /** The type of checkable */
  type?: FormCheckType;
  /** Category title of the Card */
  categoryTitle?: React.ReactNode;
}

const propTypes = {
  /**
   * The type of checkable.
   * @type {('radio' | 'checkbox' | 'switch')}
   */
  type: PropTypes.oneOf<FormCheckType>(['radio', 'checkbox', 'switch']),

  /**
   * Disables the control.
   */
  disabled: PropTypes.bool,

  /**
   * Sets card background
   *
   * @type {('primary'|'secondary'|'success'|'danger'|'warning'|'info'|'dark'|'light')}
   */
  bg: PropTypes.string,

  /**
   * Sets card text color
   *
   * @type {('primary'|'secondary'|'success'|'danger'|'warning'|'info'|'dark'|'light'|'white'|'muted')}
   */
  text: PropTypes.string,

  /**
   * Sets card border color
   *
   * @type {('primary'|'secondary'|'success'|'danger'|'warning'|'info'|'dark'|'light')}
   */
  border: PropTypes.string,

  /** Category title of the Card */
  categoryTitle: PropTypes.node
};

const defaultProps: Partial<SelectableCardProps> = {
  disabled: false,
  type: 'checkbox',
};
const SelectableCard: React.FC<SelectableCardProps> = ({
  children,
  bg,
  text,
  border,
  categoryTitle,
  ...props
}) => {
  const formCheckRef = React.useRef<HTMLInputElement>(null);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const formCheckProps = props;
  const cardProps = { bg, text, border };
  const handleSelect = () => {
    formCheckRef?.current?.click();
  };
  return (
    <Card
      ref={cardRef}
      onClick={handleSelect}
      tabIndex={0}
      variant="card-action"
      className={
        props.checked && !props.disabled
          ? 'is-active'
          : undefined
      }
      {...cardProps}
    >
      <Card.Body>
      <Card.Subtitle as="h6" className="text-muted">
        <div>{categoryTitle}</div>
        <div className="card-input">
        <FormCheck
            ref={formCheckRef}
            {...formCheckProps}
            onClick={handleSelect}
          ></FormCheck>
        </div>
        </Card.Subtitle>
        {children}
      </Card.Body>
    </Card>
  );
};

SelectableCard.displayName = 'SelectableCard';
SelectableCard.defaultProps = defaultProps;
SelectableCard.propTypes = propTypes as any;
export default SelectableCard;
