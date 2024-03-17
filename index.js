/**
 * @format
 */
import Task from './src/db/Task';
import { Schema } from './src/db/schema';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { Database } from '@nozbe/watermelondb';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

const adapter = new SQLiteAdapter({
  dbName: 'TodoDemo',
  schema: Schema,
})

export const database = new Database({
  adapter,
  modelClasses: [Task],
  actionsEnabled: true,
});

// (async () => {
//   await database.connect; // Wait for database to connect
//   console.log('Database connected:', database);
// })();

const AppWrapper = (props) => {
  return <App {...{
    ...props,
    database: database,
  }} />;
};
AppRegistry.registerComponent(appName, () => AppWrapper);
