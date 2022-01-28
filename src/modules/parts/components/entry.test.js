import Enzyme, { shallow, mount } from "enzyme";
import EnzymeAdapter from "@wojtekmaj/enzyme-adapter-react-17";
import Entry from "./entry";
import React from "react";

Enzyme.configure({ adapter: new EnzymeAdapter() });

const find = (wrapper, val) => wrapper.find({ dataTest: val });

test("renders without error", () => {
  const wrapper = shallow(<Entry />);
});

test("renders date input", () => {
  const wrapper = shallow(<Entry />);
  let salaryInput = find(wrapper, "date-input");
});
