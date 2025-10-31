import mongoose, { Document, Schema } from 'mongoose'

export interface IBoard extends Document {
  name: string
  description?: string
  creator: mongoose.Types.ObjectId
  members: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const BoardSchema: Schema = new Schema<IBoard>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }]
  },
  { timestamps: true }
)

const Board = mongoose.model<IBoard>('Board', BoardSchema)

export default Board
