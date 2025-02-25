import * as React from 'react';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import Calendar, {
  DAY_LABELS,
  daysInMonth,
  setTimeToNoon,
} from '../../src/DatePicker/Calendar';

describe('setTimeToNoon function', () => {
  it('given date prop, should return new Date hours set to 12, min 0, sec 0, ms 0', () => {
    const result = setTimeToNoon(new Date(2022, 2, 1, 13, 14, 15, 7));

    expect(result).toEqual(new Date(2022, 2, 1, 12, 0, 0, 0));
  });

  it('given date already in noon, should return new Date hours set to 12, min 0, sec 0, ms 0', () => {
    const result = setTimeToNoon(new Date(2022, 2, 1, 12, 0, 0, 0));

    expect(result).toEqual(new Date(2022, 2, 1, 12, 0, 0, 0));
  });
  it('given any date  should return new Date hours set to 12, min 0, sec 0, ms 0', () => {
    const result = setTimeToNoon(new Date());
    const assertion = new Date();
    assertion.setHours(12);
    assertion.setMinutes(0);
    assertion.setSeconds(0);
    assertion.setMilliseconds(0);
    expect(result).toEqual(assertion);
  });
});

describe('Single mode Calendar', () => {
  const mode = 'single';
  it('should have the default html structure', () => {
    const displayDate = new Date(2022, 2, 21);
    const selectedDate = new Date(2022, 2, 18);
    const mockChangeDate = jest.fn();
    const { container, getByText } = render(
      <Calendar
        changeDate={mockChangeDate}
        mode={mode}
        displayDate={displayDate}
        selectedDate={selectedDate}
      />
    );
    expect(container.querySelector('table.text-center')).toBeInTheDocument();
    DAY_LABELS.forEach((day) => {
      expect(getByText(day.slice(0, 3))).toBeInTheDocument();
    });

    const totalDaysInDisplayDate = daysInMonth[displayDate.getMonth()];
    expect(getByText(totalDaysInDisplayDate)).toBeInTheDocument();
    expect(getByText(selectedDate.getDate()).classList).toContain(
      'bg-primary-100'
    );
    expect(container.querySelectorAll('.bg-primary-100').length).toEqual(1);
  });
  it('day should have class text-primary when its current date', () => {
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));
    const displayDate = new Date('2020-01-23');
    const selectedDate = new Date('2020-01-23');
    const mockChangeDate = jest.fn();
    const { getByText, container } = render(
      <Calendar
        changeDate={mockChangeDate}
        mode={mode}
        displayDate={displayDate}
        selectedDate={selectedDate}
      />
    );

    expect(getByText('1')).toBeInTheDocument();
    expect(getByText('1').classList).toContain('text-primary');
    expect(container.querySelectorAll('.text-primary').length).toEqual(1);
    jest.clearAllTimers();
  });
  it('should show appropriate days depending on month', () => {
    const arrayOfDates = [
      new Date(2022, 0, 20),
      new Date(2022, 1, 20),
      new Date(2022, 2, 20),
      new Date(2022, 3, 20),
      new Date(2022, 4, 20),
      new Date(2022, 5, 20),
      new Date(2022, 6, 20),
      new Date(2022, 7, 20),
      new Date(2022, 8, 20),
      new Date(2022, 9, 20),
      new Date(2022, 10, 20),
      new Date(2022, 11, 20),
    ];
    const mockChangeDate = jest.fn();

    arrayOfDates.forEach((date, idx) => {
      const { getByText } = render(
        <Calendar
          changeDate={mockChangeDate}
          mode={mode}
          displayDate={date}
          selectedDate={date}
        />
      );
      const expectedLastDatePerMonth = daysInMonth[idx];
      expect(getByText(expectedLastDatePerMonth)).toBeInTheDocument();
      cleanup();
    });
  });
  it('account for leap year in feb months', () => {
    const mockChangeDate = jest.fn();
    const leapYear = [2000, 2020, 2024, 2028];
    leapYear.forEach((y) => {
      const feb = new Date(y, 1, 20);
      const { getByText } = render(
        <Calendar
          changeDate={mockChangeDate}
          mode={mode}
          displayDate={feb}
          selectedDate={feb}
        />
      );
      expect(getByText('29')).toBeInTheDocument();
      cleanup();
    });
  });
  it('end of century years but not leap year', () => {
    const mockChangeDate = jest.fn();
    const notLeapYear = [1700, 1800, 1900, 2100];
    notLeapYear.forEach((y) => {
      const feb = new Date(y, 1, 20);
      const { queryByText } = render(
        <Calendar
          changeDate={mockChangeDate}
          mode={mode}
          displayDate={feb}
          selectedDate={feb}
        />
      );
      expect(queryByText('29')).not.toBeInTheDocument();
      cleanup();
    });
  });
  it('bg-primary-100 changes with selectedDate ', () => {
    const mockChangeDate = jest.fn();
    const date = new Date(2022, 2, 20);
    const { getByText, rerender } = render(
      <Calendar
        changeDate={mockChangeDate}
        mode={mode}
        displayDate={date}
        selectedDate={date}
      />
    );
    expect(getByText('20').classList).toContain('bg-primary-100');
    rerender(
      <Calendar
        changeDate={mockChangeDate}
        mode={mode}
        displayDate={date}
        selectedDate={new Date(2022, 2, 1)}
      />
    );

    expect(getByText('20').classList).not.toContain('bg-primary-100');
    expect(getByText('1').classList).toContain('bg-primary-100');
  });
  it('clickhandler is fired when click of dates', async () => {
    const mockChangeDate = jest.fn();
    const date = new Date(2022, 2, 20);
    const { getByText } = render(
      <Calendar
        changeDate={mockChangeDate}
        mode={mode}
        displayDate={date}
        selectedDate={date}
      />
    );
    fireEvent.click(getByText('21'));
    await waitFor(() => {
      expect(mockChangeDate).toHaveBeenCalled();
    });
    fireEvent.click(getByText('21'));
    await waitFor(() => {
      expect(mockChangeDate).toHaveBeenCalled();
    });
  });
  it('clickhandler not fired when click of dates out of min and max range', async () => {
    const mockChangeDate = jest.fn();
    const date = new Date(2022, 2, 20);
    const minDate = new Date(2022, 2, 15).toISOString();
    const maxDate = new Date(2022, 2, 21).toISOString();
    const { getByText } = render(
      <Calendar
        changeDate={mockChangeDate}
        mode={mode}
        displayDate={date}
        selectedDate={date}
        minDate={minDate}
        maxDate={maxDate}
      />
    );
    const activeRange = [15, 16, 17, 18, 19, 20, 21];
    activeRange.forEach((day) => {
      expect(getByText(day).classList).not.toContain('text-muted');
      expect(getByText(day).style.cursor).toEqual('pointer');
    });

    fireEvent.click(getByText('21'));
    await waitFor(() => {
      expect(mockChangeDate).toHaveBeenCalled();
      mockChangeDate.mockReset();
    });

    fireEvent.click(getByText('15'));
    await waitFor(() => {
      expect(mockChangeDate).toHaveBeenCalled();
      mockChangeDate.mockReset();
    });
    fireEvent.click(getByText('14'));
    expect(getByText('14').classList).toContain('text-muted');
    expect(getByText('14').style.cursor).toEqual('default');
    await waitFor(() => {
      expect(mockChangeDate).not.toHaveBeenCalled();
      mockChangeDate.mockReset();
    });
    fireEvent.click(getByText('22'));
    expect(getByText('22').classList).toContain('text-muted');
    expect(getByText('22').style.cursor).toEqual('default');
    await waitFor(() => {
      expect(mockChangeDate).not.toHaveBeenCalled();
      mockChangeDate.mockReset();
    });
  });
});

describe('Range Calendar', () => {
  const mode = 'range';
  it('when two diff date selected, it reflects bg-primary-100 on the ranges', () => {
    const displayDate = new Date(2022, 2, 21);
    const selectedDate = { start: new Date(2022, 2, 18), end: new Date(2022, 2, 20) };
    const mockChangeDate = jest.fn();
    const { container, getByText } = render(
      <Calendar
        changeDate={mockChangeDate}
        mode={mode}
        displayDate={displayDate}
        selectedDate={selectedDate}
      />
    );
    expect(container.querySelectorAll('.bg-primary-100').length).toEqual(3);
    [18, 19, 20].forEach((day) => {
      expect(getByText(day).classList).toContain('bg-primary-100');
    });
    [1,5,6,21,24,27].forEach((day) => {
        expect(getByText(day).classList).not.toContain('bg-primary-100')
    })
  });
  it('the sequence of selectedDates should not matter', () => {
    const displayDate = new Date(2022, 2, 21);
    const selectedDate = { start: new Date(2022, 2, 20), end: new Date(2022, 2, 18) };
    const mockChangeDate = jest.fn();
    const { container, getByText } = render(
      <Calendar
        changeDate={mockChangeDate}
        mode={mode}
        displayDate={displayDate}
        selectedDate={selectedDate}
      />
    );
    expect(container.querySelectorAll('.bg-primary-100').length).toEqual(3);
    [18, 19, 20].forEach((day) => {
      expect(getByText(day).classList).toContain('bg-primary-100');
    });
    [1,5,6,21,24,27].forEach((day) => {
        expect(getByText(day).classList).not.toContain('bg-primary-100')
    })
  });
});
