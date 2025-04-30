import { getFirestore } from "#/resources/instances/firestore";

const run = async () => {
  const store = getFirestore()

  const ref = store.collection('games')
  const allGames = await ref.get()

  allGames.forEach(doc => {
    ref.doc(doc.id).delete()
    // console.log(doc.id, '=>', doc.data());
  });

}

run()