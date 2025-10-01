import { initFirestore } from '../external/firestore';
import { getUnstableQueue } from '../external/unstableQueue';
import { containerFactor, RegisteredContext } from '#shared/utils/container';

export const container = containerFactor<RegisteredContext>({
  initContext: async () => {
    return {
      firestore: await initFirestore(),
      unstableQueue: getUnstableQueue(),
    };
  },
});
