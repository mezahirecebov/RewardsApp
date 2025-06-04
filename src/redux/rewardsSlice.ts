import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export type Reward = {
  id: string;
  name: string;
  needed_points: number;
  pictures?: string[];
  image?: string;
};

interface RewardsState {
  collected: Reward[];
}

const initialState: RewardsState = {
  collected: [],
};

const rewardsSlice = createSlice({
  name: 'rewards',
  initialState,
  reducers: {
    collectReward: (state, action: PayloadAction<Reward>) => {
      const alreadyCollected = state.collected.find(
        r => r.id === action.payload.id,
      );
      if (!alreadyCollected) {
        state.collected.push(action.payload);
      }
    },
  },
});

export const {collectReward} = rewardsSlice.actions;

export default rewardsSlice.reducer;
