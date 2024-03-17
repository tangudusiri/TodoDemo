import { appSchema, tableSchema } from "@nozbe/watermelondb";

export const Schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'tasks',
      columns: [
        { name: 'description', type: 'string' },
        { name: 'is_completed', type: 'boolean' },
        { name: 'created_at', type: 'number' },
      ]
    })
  ]
})