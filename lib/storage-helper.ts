// Client-side storage helper with IndexedDB resilience & image optimization

import { PortfolioProject } from './portfolio-data';
import { HomePageData } from './home-data';

const DB_NAME = 'shazzad_portfolio_db';
const DB_VERSION = 2;
const STORE_PROJECTS = 'projects_store';
const STORE_HOME = 'home_store';
const KEY_PROJECTS = 'all_projects';
const KEY_HOME = 'home_page_data';

// Open or initialize IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_PROJECTS)) {
        db.createObjectStore(STORE_PROJECTS);
      }
      if (!db.objectStoreNames.contains(STORE_HOME)) {
        db.createObjectStore(STORE_HOME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Save project array to IndexedDB
export async function saveProjectsToIDB(projects: PortfolioProject[]): Promise<boolean> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_PROJECTS, 'readwrite');
      const store = tx.objectStore(STORE_PROJECTS);
      const req = store.put(projects, KEY_PROJECTS);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
}

// Load project array from IndexedDB
export async function loadProjectsFromIDB(): Promise<PortfolioProject[] | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_PROJECTS, 'readonly');
      const store = tx.objectStore(STORE_PROJECTS);
      const req = store.get(KEY_PROJECTS);
      req.onsuccess = () => {
        const result = req.result;
        if (Array.isArray(result) && result.length > 0) {
          resolve(result);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

// Save home page data to IndexedDB
export async function saveHomeDataToIDB(homeData: HomePageData): Promise<boolean> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_HOME, 'readwrite');
      const store = tx.objectStore(STORE_HOME);
      const req = store.put(homeData, KEY_HOME);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
}

// Load home page data from IndexedDB
export async function loadHomeDataFromIDB(): Promise<HomePageData | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_HOME, 'readonly');
      const store = tx.objectStore(STORE_HOME);
      const req = store.get(KEY_HOME);
      req.onsuccess = () => {
        const result = req.result;
        if (result && typeof result === 'object' && result.hero) {
          resolve(result);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

// Compress user-uploaded image files to prevent quota exhaustion
export function compressImageFile(
  file: File,
  maxWidth = 1600,
  quality = 0.86
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string;
      if (typeof window === 'undefined') {
        resolve(rawDataUrl);
        return;
      }

      const img = new window.Image();
      img.onerror = () => resolve(rawDataUrl);
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Maintain aspect ratio while bounding max dimension
          if (width > maxWidth || height > maxWidth) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxWidth) / height);
              height = maxWidth;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(rawDataUrl);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          // Try webp first for maximum compression efficiency, fall back to jpeg
          const webpData = canvas.toDataURL('image/webp', quality);
          if (webpData.startsWith('data:image/webp')) {
            resolve(webpData);
          } else {
            resolve(canvas.toDataURL('image/jpeg', quality));
          }
        } catch {
          resolve(rawDataUrl);
        }
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  });
}
