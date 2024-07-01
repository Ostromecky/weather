import {firestore, config} from 'firebase-functions';
import algoliasearch from 'algoliasearch';

const appId = config().algolia.app
const apiKey = config().algolia.key;

const client = algoliasearch(appId, apiKey);
const index = client.initIndex('cities');


export const addToIndex = firestore.document('cities/{cityId}')
  .onCreate((snapshot) => {
    const data = snapshot.data();
    const objectId = snapshot.id;

    return index.saveObject({...data, objectId});
  })


export const updateIndex = firestore.document('cities/{cityId}')
  .onUpdate((change) => {
    const newData = change.after.data();
    const objectId = change.after.id;

    return index.saveObject({...newData, objectId});
  })


export const deleteIndex = firestore.document('cities/{cityId}').onDelete(snapshot =>
  index.deleteObject(snapshot.id)
)

