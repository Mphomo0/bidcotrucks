// import { Schema, model, models } from 'mongoose'
// import slugify from 'slugify'

// const vehicleSchema = new Schema(
//   {
//     title: String,
//     make: String,
//     model: String,
//     year: Number,
//     price: Number,
//     mileage: Number,
//     images: [String],
//     description: String,
//     slug: { type: String, unique: true },
//     status: {
//       type: String,
//       enum: ['available', 'sold'],
//       default: 'available',
//     },
//     category: {
//       type: Schema.Types.ObjectId,
//       ref: 'Category',
//     },
//   },
//   { timestamps: true }
// )

// // Generate slug before saving
// vehicleSchema.pre('save', function (next) {
//   if (
//     this.isModified('title') &&
//     this.title !== null &&
//     this.title !== undefined
//   ) {
//     this.slug = slugify(this.title, { lower: true, strict: true })
//   }
//   next()
// })

// export default models.Vehicle || model('Vehicle', vehicleSchema)
