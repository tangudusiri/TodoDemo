import { Model } from "@nozbe/watermelondb";
import { field, date, readonly } from '@nozbe/watermelondb/decorators';
export default class Task extends Model {
  static table = 'tasks'
  @field('description') description
  @field('is_completed') isCompleted
  @readonly @date('created_at') createdAt

}