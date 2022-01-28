import Enzyme, { shallow, mount } from 'enzyme';
import EnzymeAdapter from '@wojtekmaj/enzyme-adapter-react-17';
import App from './App';
import Details from './components/Details'
import React from 'react';

Enzyme.configure({ adapter: new EnzymeAdapter() });

const find = (wrapper, val) => wrapper.find({dataTest: val})

test('renders without error', () => {
  const wrapper = shallow(<App />);
});

test('renders salary input', () => {
  const wrapper = shallow(<App />);
  let salaryInput = find(wrapper, 'salary-input');
});

test('renders extra deduction', () => {
  const wrapper = shallow(<App />);
  const extraDeduction = find(wrapper, 'extra-deduction');
});

test('renders calculate button', () => {
  const wrapper = shallow(<App />);
  const calculateButton = find(wrapper, 'calculate-button');
});

test('renders TIAT annual and have 0 as initial value', () => {
  const wrapper = shallow(<App />);
  const tiatAnnual = find(wrapper, 'tiat-annual').text();
  expect(tiatAnnual).toBe('0Rs.')
});

test('renders TIAT month and have 0 as initial value', () => {
  const wrapper = shallow(<App />);
  const tiatMonth = find(wrapper, 'tiat-month').text();
  expect(tiatMonth).toBe('0Rs.')
});

test('changing salary value should enables the calculate button', () => {
  let wrapper = shallow(<App />);
  let calculateButton = find(wrapper, 'calculate-button');
  const tmp = calculateButton.find({ disabled: true })
  expect(tmp.exists()).toBe(true)

  const salaryInput = find(wrapper, 'salary-input');
  salaryInput.simulate('change', { target: { name: 'ctc', value: '1' } });
  
  calculateButton = find(wrapper, 'calculate-button');
  expect(calculateButton.find({ disabled: false }).exists()).toBe(true)
})

test('clicking on calculate button calculate TAIT', () => {
  const wrapper = shallow(<App />);
  let salaryInput = find(wrapper, 'salary-input');
  salaryInput.simulate('change', { target: { value: '1000000' } });
  const extraDeduction = find(wrapper, 'extra-deduction');
  extraDeduction.simulate('change', { target: { value: '100000' } });

  const calculateButton = find(wrapper, 'calculate-button');
  calculateButton.simulate('click');
  const tiatAnnual = find(wrapper, 'tiat-annual');
  expect(tiatAnnual.text()).toBe('983820Rs.');
})

describe('rendering table properly', () => {
  const wrapper = shallow(<App />);
  let tbody;


  test('rendering table', () => {
    let table = find(wrapper, 'table');
    expect(table.exists()).toBe(true);
  })

  beforeEach(() => {
    const calculateButton = find(wrapper, 'calculate-button');
    calculateButton.simulate('click');
    tbody = find(wrapper, 'tbody');
  })

  test('table has 3 rows', () => {
    const rows = tbody.find('tr');
    expect(rows.length).toBe(3);
  })

  test('table rows are clickable', () => {
    let row = tbody.find('tr').at(0);
    expect(row.props().onClick).toBeDefined()
  })

  test('clicking on row will redirect the page', () => {
    let row = tbody.find('tr').at(0);
    row.simulate('click');
    expect(wrapper.find(Details)).toHaveLength(1);
  })
})
