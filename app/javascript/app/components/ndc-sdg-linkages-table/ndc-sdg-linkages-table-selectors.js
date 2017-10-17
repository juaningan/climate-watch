import { createSelector } from 'reselect';
import groupBy from 'lodash/groupBy';

const getGoals = state => state.meta.goals || null;
const getTargets = state => state.meta.targets || null;
const getSelectedGoal = state => parseInt(state.selectedGoal, 10) || null;

export const getTargetsByGoal = createSelector(getTargets, targets => {
  if (!targets) return null;
  return groupBy(targets, 'goal_number');
});

export const getParsedGoals = createSelector(
  [getGoals, getTargetsByGoal],
  (goals, targets) => {
    if (!goals || !targets) return null;
    const parsedGoals = goals.map(goal => ({
      id: goal.id,
      title: goal.cw_title,
      number: parseInt(goal.number, 10),
      targets: targets[goal.number]
    }));
    parsedGoals.push({ title: 'empty to have round number of elements' });
    return parsedGoals;
  }
);

export const getGoalSelected = createSelector(
  [getParsedGoals, getSelectedGoal],
  (goals, selected) => {
    if (!goals || !selected) return null;
    return goals.find(g => g.number === selected);
  }
);

export default {
  getParsedGoals,
  getGoalSelected
};