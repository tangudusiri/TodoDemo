import { schemaMigrations, createTable } from '@nozbe/watermelondb/Schema/migrations'

export const migrations = schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [
        createTable({
          name: 'tasks',
          columns: [
            { name: 'description', type: 'string' },
            { name: 'is_completed', type: 'boolean' },
            { name: 'created_at', type: 'number' },
          ]
          }),
      ],
    },
  ],
});