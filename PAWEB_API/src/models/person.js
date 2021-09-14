const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    identityType: { type: String, uppercase: true, trim: true },
    identityDocument: { type: String, unique: true, trim: true, index: true },
    firstName: { type: String, uppercase: true, trim: true },
    lastName: { type: String, uppercase: true, trim: true },
    address: { type: String, uppercase: true, trim: true },
    phone: { type: String, trim: true },
    city: { type: String, uppercase: true, trim: true }
},{
    timestamps:false,
    versionKey:false,
    toObject: { virtuals: true },
    toJSON: { virtuals: true } 
})

schema.virtual('fullName').get(function() {
    return [this.firstName, this.lastName].filter(Boolean).join(' ');
});


module.exports = mongoose.model('People', schema)