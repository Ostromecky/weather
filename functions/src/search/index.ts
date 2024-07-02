import {logger, region} from 'firebase-functions';
import algoliasearch from 'algoliasearch';
import {onDocumentCreated} from 'firebase-functions/v2/firestore';


const appId = process.env['APP_ID'] ?? '';
const apiKey = process.env['firestore-algolia-search-ALGOLIA_API_KEY'] ?? '';

const client = algoliasearch(appId, apiKey);
const index = client.initIndex('cities');





export const addToIndex = onDocumentCreated('cities/{docId}', (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    logger.error('[ERROR]: ', 'No data associated with the event');
    return;
  }
  const data = snapshot.data();
  const objectId = snapshot.id;
  return index.saveObject({...data, objectId});
})


export const updateIndex = region('europe-central2').firestore.document('cities/{cityId}')
  .onUpdate((change) => {
    const newData = change.after.data();
    const objectId = change.after.id;

    return index.saveObject({...newData, objectId});
  })


export const deleteIndex = region('europe-central2').firestore.document('cities/{cityId}').onDelete(snapshot =>
  index.deleteObject(snapshot.id)
)

