/**
 * @format
 */
import React from 'react';
import Task from './src/db/Task';
import { Schema } from './src/db/schema';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { migrations } from './src/db/migrations';
import { Database } from '@nozbe/watermelondb';
import { synchronize } from '@nozbe/watermelondb/sync';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

const adapter = new SQLiteAdapter({
  dbName: 'TodoDemo',
  schema: Schema,
  migrations
});

export const database = new Database({
  adapter,
  modelClasses: [Task],
  actionsEnabled: true,
});

(async () => {
  await database.connect(); // Wait for database to connect
})();

export default async function mySync() {
  try {
    await synchronize({
      database,
      pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
        const { changes, timestamp } = await mockPullFromDatabase({
          lastPulledAt,
          schemaVersion,
          migration,
        });
        console.log("Pull changes------>", changes);
        return { changes, timestamp };
      },
      pushChanges: async ({ changes, lastPulledAt }) => {
        await mockPushToDatabase({ changes, lastPulledAt });
      },
      migrationsEnabledAtVersion: 2,
    });

    // Delete local data after successful synchronization
    // await deleteLocalData();
  } catch (error) {
    console.error('Error during synchronization:', error);
    // Handle error if necessary
  }
}

async function mockPullFromDatabase({ lastPulledAt, schemaVersion, migration }) {
  const changes = {
    tasks: { created: [], updated: [], deleted: [] },
  };
  const timestamp = new Date().getTime();
  console.log('Pulling changes------->', JSON.stringify(changes));
  return { changes, timestamp };
}

async function mockPushToDatabase({ changes, lastPulledAt }) {
  console.log('Pushing changes------->', JSON.stringify(changes), 'Last pulled at:', lastPulledAt);
}

export async function deleteLocalData() {
  try {
    await database.write(async () => {
      const allTasks = await database.collections.get('tasks').query().fetch();
      await Promise.all(allTasks.map(async task => {
        if (task._raw._status === 'synced') {
          await task.destroyPermanently();
        }
      }));
    });
  } catch (error) {
    console.error('Error deleting local data:', error);
    // Handle error if necessary
  }
}

const AppWrapper = (props) => {
  return <App {...props} database={database} />;
};

AppRegistry.registerComponent(appName, () => AppWrapper);