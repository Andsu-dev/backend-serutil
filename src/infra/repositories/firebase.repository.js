const {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  setDoc,
} = require("firebase/firestore");
const { db } = require("../../database/db");
const RepositoryInterface = require("../../core/interfaces/repository.interface");
const {
  RepositoryError,
  DocumentNotFoundError,
  DuplicateKeyError,
} = require("../../core/errors/repository.error");
const timestampToDate = require("../../utils/date.utils");

class FirebaseRepository extends RepositoryInterface {
  constructor(collectionName) {
    super();
    this.collectionName = collectionName;
    this.collectionRef = collection(db, collectionName);
  }

  async create(data) {
    try {
      const docRef = await addDoc(this.collectionRef, {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return { id: docRef.id, ...data };
    } catch (error) {
      if (error.code === "permission-denied") {
        throw new RepositoryError("Permission denied to create document");
      }
      if (error.code === "already-exists") {
        throw new DuplicateKeyError("Document already exists");
      }
      throw new RepositoryError(`Error creating document: ${error.message}`);
    }
  }

  async setDoc(path, data) {
    try {
      const docRef = doc(db, `${this.collectionName}/${path}`);
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined)
      );

      const cleanData = await timestampToDate(filteredData);

      await setDoc(docRef, {
        ...cleanData,
        updatedAt: new Date().toISOString(),
      });
      return { id: docRef.id, ...cleanData };
    } catch (error) {
      if (error.code === "permission-denied") {
        throw new RepositoryError("Permission denied to set document");
      }
      throw new RepositoryError(`Error setting document: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new DocumentNotFoundError(id);
      }

      return { id: docSnap.id, ...docSnap.data() };
    } catch (error) {
      if (error instanceof DocumentNotFoundError) {
        throw error;
      }
      throw new RepositoryError(`Error finding document: ${error.message}`);
    }
  }

  async findAll(queryParams = {}) {
    try {
      let q = this.collectionRef;

      if (Object.keys(queryParams).length > 0) {
        const conditions = Object.entries(queryParams).map(([field, value]) =>
          where(field, "==", value)
        );
        q = query(this.collectionRef, ...conditions);
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      throw new RepositoryError(`Error finding documents: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new DocumentNotFoundError(id);
      }

      await deleteDoc(docRef);
      return true;
    } catch (error) {
      if (error instanceof DocumentNotFoundError) {
        throw error;
      }
      throw new RepositoryError(`Error deleting document: ${error.message}`);
    }
  }
}

module.exports = FirebaseRepository;
