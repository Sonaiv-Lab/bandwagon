import { getFirestore } from '#/resources/db/firestore';

const run = async () => {
  const store = await getFirestore();

  const ref = store.collection('games');
  const allGames = await ref.get();

  allGames.forEach((doc) => {
    ref.doc(doc.id).delete();
    // console.log(doc.id, '=>', doc.data());
  });
};

run();
