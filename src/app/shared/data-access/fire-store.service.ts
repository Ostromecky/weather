import {inject, Injectable} from '@angular/core';
import {first, from, map, Observable, Subject} from "rxjs";
import {FIRE_STORE_CONFIG, FireStoreConfig} from "./provider";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc
} from "@angular/fire/firestore";
import {SetOptions} from "@angular/fire/compat/firestore";
import {QueryCompositeFilterConstraint, QueryConstraint, UpdateData} from "@firebase/firestore";
import {Entity} from "./fire-store.model";

@Injectable()
export class FireStoreService<T extends object, E extends Entity = T & Entity> {
  private firestore: Firestore = inject(Firestore);
  private config: FireStoreConfig = inject(FIRE_STORE_CONFIG);
  private collectionRef = collection(this.firestore, this.config.collection);

  // items$: Observable<T[]> = this.firestore.collection<T>(this.config.collection).valueChanges();
  // items: Signal<T[] | undefined> = toSignal(this.items$);

  add(data: T) {
    return from(addDoc(this.collectionRef, data)).pipe(
      first(),
      map(docRef => docRef.id)
    );
  }

  /**
   * Update a document partially without overwriting the entire document.
   * @param docId
   * @param data
   */
  update(docId: string, data: UpdateData<T>): Observable<void> {
    const docRef = doc(this.firestore, this.config.collection, docId);
    return from(updateDoc(docRef, data));
  }

  /**
   * Create or overwrite a single document with meaningful docId.
   * @param docId
   * @param data
   * @param options
   */
  set(data: T, docId: string, options?: SetOptions) {
    const docRef = doc(this.collectionRef, docId);
    const next$ = new Subject<void>();
    from(setDoc(docRef, data)).pipe(
      first()
    ).subscribe(next$
    );
    return next$.asObservable();
  }

  delete(docId: string) {
    const docRef = doc(this.collectionRef, docId);
    from(deleteDoc(docRef)).pipe(
      first()
    ).subscribe();
  }

  getById(docId: string): Observable<E> {
    const docRef = doc(this.collectionRef, docId);
    return from(getDoc(docRef)).pipe(
      first(),
      map(doc => doc.data() as E)
    );
  }

  findByQuery(queries: QueryConstraint[] | QueryCompositeFilterConstraint): Observable<E[]> {
    let q;

    if (Array.isArray(queries)) {
      q = query(this.collectionRef, ...queries);

    } else {
      q = query(this.collectionRef, queries);
    }
    return from(getDocs(q)).pipe(map(snapshot => snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()} as E))));
  }
}
