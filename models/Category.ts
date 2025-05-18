// import { Schema, model, models } from 'mongoose'
// import slugify from 'slugify'

// const categorySchema = new Schema(
//   {
//     name: { type: String, required: true, unique: true },
//     slug: { type: String, unique: true },
//   },
//   { timestamps: true }
// )

// // Generate slug before saving
// categorySchema.pre('save', function (next) {
//   if (this.isModified('name')) {
//     this.slug = slugify(this.name, { lower: true, strict: true })
//   }
//   next()
// })

// export default models.Category || model('Category', categorySchema)
