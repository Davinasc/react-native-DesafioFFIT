export const MedicationSchema = {
  name: 'Medication',
  primaryKey: 'id',
  properties: {
    id: 'int',
    name: 'string',
    dose: { type: 'string', optional: true },
    frequency: 'int',
    interval: { type: 'int', optional: true },
    duration: { type: 'int', optional: true },
    annotations: { type: 'string', optional: true },
    starts_at: 'int',
    user_id: 'int',
    user_medication_alarms: { type: 'list', objectType: 'MedicationAlarm' },
  },
};

export const MedicationAlarmSchema = {
  name: 'MedicationAlarm',
  primaryKey: 'id',
  properties: {
    id: 'int',
    alarm_time: 'int',
    user_medication_id: { type: 'linkingObjects', objectType: 'Medication', property: 'user_medication_alarms' },
    notification: { type: 'Notification' },
  },
};

export const NotificationSchema = {
  name: 'Notification',
  primaryKey: 'id',
  properties: {
    id: 'int',
    type: 'int', // 0 -> medications (local), 1 -> exams notifications (remote), 2 -> doctor auth notification (local), 3 -> ? ...
    alarm_time: 'int',
    title: 'string',
    message: { type: 'string', optional: true },
    submessage: { type: 'string', optional: true },
    status: 'int', // 0 -> not fired and not readed; 1 -> fired but not readed; 2 -> fired and readed; 3 -> hidden
    user_medication_id: { type: 'int', optional: true },
    additional_identifier: { type: 'string', optional: true },
    additional_value: { type: 'string', optional: true },
    duration: { type: 'int', optional: true },
  },
};
