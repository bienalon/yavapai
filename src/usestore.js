import { createSubscriber, createHook } from 'react-sweet-state';
import { Store } from "./store";

export const useStore = createHook(Store);