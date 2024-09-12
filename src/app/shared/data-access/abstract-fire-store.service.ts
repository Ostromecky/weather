import { DestroyRef, inject, Injectable } from '@angular/core';
import { finalize, first, from, map, Observable, Subject } from "rxjs";
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
  QueryCompositeFilterConstraint,
  QueryConstraint,
  serverTimestamp,
  setDoc,
  UpdateData,
  updateDoc
} from "@angular/fire/firestore";
import { SetOptions } from "@angular/fire/compat/firestore/";
import { Entity } from "./fire-store.model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FireStoreConfig } from './types';

@Injectable()
export abstract class AbstractFireStoreService<T extends object, E extends Entity = T & Entity> {
  private destroyRef = inject(DestroyRef);
  private firestore: Firestore = inject(Firestore);
  private collectionRef = collection(this.firestore, this.config.collection);

  constructor(private config: FireStoreConfig) {
  }

  collectionData$: Observable<T[]> = collectionData(this.collectionRef).pipe(map((data) => data as T[]));

  add(data: T): Observable<E> {
    return from(addDoc(this.collectionRef, {
      ...data,
      createdAt: this.timestamp,
    })).pipe(
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
    return from(updateDoc(docRef, {
      ...data,
      updatedAt: this.timestamp
    }));
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
    from(setDoc(docRef, {
      ...data,
      createdAt: this.timestamp,
      updatedAt: this.timestamp
    })).pipe(
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

  getDocsChangesByQuery(query: QueryConstraint, ...queries: QueryConstraint[]): Observable<E[]>
  getDocsChangesByQuery(compositeFilterConstraint: QueryCompositeFilterConstraint): Observable<E[]>
  getDocsChangesByQuery(queries: QueryCompositeFilterConstraint | QueryConstraint | QueryConstraint[]): Observable<E[]> {
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

  private get timestamp() {
    return serverTimestamp()
  }
}
