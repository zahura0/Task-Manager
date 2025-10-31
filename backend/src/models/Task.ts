import mongoose, { Document, Schema } from 'mongoose'

export interface ITask extends Document {
  title: string
  description?: string
  status: 'todo' | 'in-progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  assignee?: string
  dueDate?: Date
  userId: mongoose.Types.ObjectId
  boardId?: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const TaskSchema: Schema = new Schema<ITask>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    assignee: { type: String, default: '' },
    dueDate: { type: Date, default: null },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    boardId: { type: Schema.Types.ObjectId, ref: 'Board', default: null }
  },
  { timestamps: true }
)

const Task = mongoose.model<ITask>('Task', TaskSchema)

export default Task
