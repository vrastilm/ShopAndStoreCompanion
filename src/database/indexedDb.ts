import Dexie from 'dexie';
import 'dexie-observable';
import { exportDB, importInto } from 'dexie-export-import';
import { DateTime } from 'luxon';
import { dateFormat } from '../modules/shopList/ShopListState';

const db = new Dexie('ShopAndStoreCompanionDB');

// db architecture
db.version(1).stores({ ShopItem: 'id' });

async function exportDb() {
  const blob = await exportDB(db, { prettyJson: true });

  const csvURL = window.URL.createObjectURL(blob);
  const tempLink = document.createElement('a');

  tempLink.href = csvURL;
  tempLink.setAttribute('download', `db_backup_${DateTime.local().toFormat(dateFormat)}.json`);
  tempLink.click();
}

const assingOnChangeHandler = (func: Function) => {
  db.on('versionchange', () => func());
};

const handleInputFilesAndImport = async (
  event: React.ChangeEvent<HTMLInputElement>,
  startLoading: Function,
  setOpenMenu: Function,
  finishedLoadingSucces: Function,
  finishedLoadingError: Function
) => {
  if (event.target && event.target.files) {
    try {
      setOpenMenu(false);
      startLoading();
      const file = event.target.files[0];

      await importInto(db, file, { overwriteValues: true });
      finishedLoadingSucces();
      window.location.reload(false);
    } catch (err) {
      finishedLoadingError(err);
    }
  }
};

function importDb(
  startLoading: Function,
  setOpenMenu: Function,
  finishedLoadingSucces: Function,
  finishedLoadingError: Function
) {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.onchange = (e) =>
    handleInputFilesAndImport(
      e,
      startLoading,
      setOpenMenu,
      finishedLoadingSucces,
      finishedLoadingError
    );
  input.click();
}

export { exportDb, importDb, assingOnChangeHandler };
export default db;
