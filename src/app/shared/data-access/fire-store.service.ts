import { DestroyRef, inject, Injectable } from '@angular/core';
import { finalize, first, from, map, Observable, Subject } from "rxjs";
import { FIRE_STORE_CONFIG, FireStoreConfig } from "./provider";
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc
} from "@angular/fire/firestore";
import { SetOptions } from "@angular/fire/compat/firestore";
import { QueryCompositeFilterConstraint, QueryConstraint, UpdateData } from "@firebase/firestore";
import { Entity } from "./fire-store.model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Injectable()
export class FireStoreService<T extends object, E extends Entity = T & Entity> {
  private destroyRef = inject(DestroyRef);
  private firestore: Firestore = inject(Firestore);
  private config: FireStoreConfig = inject(FIRE_STORE_CONFIG);
  private collectionRef = collection(this.firestore, this.config.collection);

  collectionData$: Observable<T[]> = collectionData(this.collectionRef).pipe(map((data) => data as T[]));

  add(data: T): Observable<E> {
    return from(addDoc(this.collectionRef, data)).pipe(
      first(),
      map(docRef => ({id: docRef.id, ...data} as unknown as E))
    );
  }

  /**
   * Update a document partially without overwriting the entire document.
   * @param docId
   * @param data
   */
  update(docId: string, data: UpdateData<T>): Observable<void> {
    const docRef = doc(this.collectionRef, docId);
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
      map(doc => ({...doc.data(), id: doc.id}) as E)
    );
  }
  findByQuery(...queries: QueryConstraint[]): Observable<E[]>
  findByQuery(compositeFilterConstraint: QueryCompositeFilterConstraint): Observable<E[]>
  findByQuery(queries: QueryCompositeFilterConstraint | QueryConstraint | QueryConstraint[]): Observable<E[]> {
    let q;

    if (Array.isArray(queries)) {
      q = query(this.collectionRef, ...queries);
    } else if (queries instanceof QueryCompositeFilterConstraint) {
      q = query(this.collectionRef, queries);
    } else {
      q = query(this.collectionRef, queries)
    }
    return from(getDocs(q)).pipe(map(snapshot => snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()} as E))));
  }

  getDocChanges(docId: string): Observable<E> {
    const docRef = doc(this.collectionRef, docId);
    const next$ = new Subject<E>();
    const unsub = onSnapshot(docRef, (doc) => {
      next$.next({...doc.data(), id: doc.id} as E);
    });
    return next$.pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => unsub())
    );
  }

  getDocChangesByQuery(query: QueryConstraint, ...queries: QueryConstraint[]): Observable<E[]>
  getDocChangesByQuery(compositeFilterConstraint: QueryCompositeFilterConstraint): Observable<E[]>
  getDocChangesByQuery(queries: QueryCompositeFilterConstraint | QueryConstraint | QueryConstraint[]): Observable<E[]> {
    let q;
    if (Array.isArray(queries)) {
      q = query(this.collectionRef, ...queries);

    } else if (queries instanceof QueryCompositeFilterConstraint) {
      q = query(this.collectionRef, queries);
    } else {
      q = query(this.collectionRef, queries)
    }

    const next$ = new Subject<E[]>();
    const unsub = onSnapshot(q, {
      next: (snapshot) => {
        next$.next(snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()} as E)));
      }
    });
    return next$.pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => unsub())
    );
  }
}
