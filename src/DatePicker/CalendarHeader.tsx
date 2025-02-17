import * as React from 'react';
import { useContext } from 'react';
import DatePickerContext from './DatePickerContext';
interface CalendarHeaderProps {
  displayDate: Date;
  onChange: (date: Date) => void;
}
export const MONTH_LABELS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ ...props }) => {
  const { view, setView } = useContext(DatePickerContext);

  const handleClickPrevious = () => {
    const newDisplayDate = new Date(props.displayDate);
    newDisplayDate.setDate(1);
    if (view === 'month') {
      newDisplayDate.setFullYear(newDisplayDate.getFullYear() - 1);
      return props.onChange(newDisplayDate);
    } else if (view === 'year') {
      newDisplayDate.setFullYear(newDisplayDate.getFullYear() - 10);
      return props.onChange(newDisplayDate);
    } else {
      newDisplayDate.setMonth(newDisplayDate.getMonth() - 1);
      return props.onChange(newDisplayDate);
    }
  };

  const handleClickNext = () => {
    const newDisplayDate = new Date(props.displayDate);
    newDisplayDate.setDate(1);

    if (view === 'month') {
      newDisplayDate.setFullYear(newDisplayDate.getFullYear() + 1);
      return props.onChange(newDisplayDate);
    } else if (view === 'year') {
      newDisplayDate.setFullYear(newDisplayDate.getFullYear() + 10);
      return props.onChange(newDisplayDate);
    } else {
      newDisplayDate.setMonth(newDisplayDate.getMonth() + 1);
      return props.onChange(newDisplayDate);
    }
  };

  const changeView = () => {
    switch (view) {
      case 'day':
        setView('month');
        break;
      case 'month':
        setView('year');
        break;
      case 'year':
        break;
    }
  };
  const renderHeader = () => {
    if (view === 'month') {
      return `${props.displayDate.getFullYear()}`;
    }
    if (view === 'year')
      return `${props.displayDate.getFullYear() - 5} - ${
        props.displayDate.getFullYear() + 6
      }`;
    return `${
      MONTH_LABELS[props.displayDate.getMonth()]
    } ${props.displayDate.getFullYear()}`;
  };
  return (
    <div className="text-center d-flex justify-content-between">
      <button onClick={handleClickPrevious} aria-label={`previous ${view}`}>
        <i className="bi bi-chevron-left"></i>
      </button>
      

      <button onClick={changeView} disabled={view === 'year'} aria-live='polite'>
        {renderHeader()}
      </button>

      <button onClick={handleClickNext} aria-label={`next ${view}`}>
        <i className="bi bi-chevron-right"></i>
      </button>
    </div>
  );
};
export default CalendarHeader;
