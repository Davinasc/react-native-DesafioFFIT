import Realm from 'realm';
import to from 'await-to-js';
import { MedicationSchema, MedicationAlarmSchema, NotificationSchema } from './schema';

export default class RealmActions {
  static async openRealm() {
    return Realm.open({
      schema: [MedicationSchema, MedicationAlarmSchema, NotificationSchema],
      schemaVersion: 1.5
    }).then((realm) => {
      return realm;
    }).catch((err) => {
      throw new Error(err);
    });
  }

  static async save(table, data) {
    const [err, realm] = await to(this.openRealm());
    if (err) {
      throw new Error(err);
    }

    if (data) {
      try {
        realm.write(() => {
          realm.create(table, data);
        });
      } catch (error) {
        throw new Error(error);
      }
    }
  }

  static async saveMany(table, data) {
    const [err, realm] = await to(this.openRealm());
    if (err) {
      throw new Error(err);
    }

    if (data && data.length > 0) {
      try {
        realm.write(() => {
          data.map((each) => {
            realm.create(table, each);
          });
        });
      } catch (error) {
        throw new Error(error);
      }
    }
  }

  static async get(table, filter, sortField, sortDescending) {
    let [err, realm] = await to(this.openRealm());
    if (err) {
      throw new Error(err);
    }
    try {
      const results = (filter) ? await realm.objects(table).filtered(filter) : await realm.objects(table);
      return (sortField) ? results.sorted(sortField, sortDescending) : results;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async getLastInsertedId(table) {
    const [err, realm] = await to(this.openRealm());
    if (err) {
      throw new Error(err);
    }
    try {
      let objects = realm.objects(table);
      let realmId = ((objects.length > 0) ? objects[objects.length -1].id : 1);
      return realmId;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async update(table, data) {
    const [err, realm] = await to(this.openRealm());
    if (err) {
      throw new Error(err);
    }
    try {
      realm.write(() => {
        realm.create(table, data, true);
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  static async updateMany(table, data) {
    const [err, realm] = await to(this.openRealm());
    if (err) {
      throw new Error(err);
    }

    if (data && data.length > 0) {
      try {
        realm.write(() => {
          data.map((each) => {
            realm.create(table, each, true);
          });
        });
      } catch (error) {
        throw new Error(error);
      }
    }
  }

  static async deleteOne(data) {
    const [err, realm] = await to(this.openRealm());
    if (err) {
      throw new Error(err);
    }
    try {
      realm.write(() => {
        realm.delete(data);
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  static async deleteAll() {
    const [err, realm] = await to(this.openRealm());
    if (err) {
      throw new Error(err);
    }
    try {
      realm.write(() => {
        let medication = realm.objects('Medication');
        let medicationAlarm = realm.objects('MedicationAlarm');
        let notifications  = realm.objects('Notification');

        realm.delete(medicationAlarm);
        realm.delete(medication);
        realm.delete(notifications);
      });
    } catch (error){
      throw new Error(error);
    }
  }
}
