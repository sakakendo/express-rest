const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const TaskSchema = new Schema({
    title: {type: String, default: ''},
    note: {type: String, default: ''},
    completed: {type: Boolean, default: false},
    due: {type: Date},
    owner: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    created_at: {type: Date, default: Date.now}
});

mongoose.model('Task', TaskSchema);
