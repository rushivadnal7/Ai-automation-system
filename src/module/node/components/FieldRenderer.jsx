import React from 'react';
import { fieldStrategyFactory } from '../../../strategies/FieldStrategy';

export const FieldRenderer = ({ field, value, onChange }) => {
  const strategy = fieldStrategyFactory.getStrategy(field);
  return strategy.render(field, value, onChange);
};
