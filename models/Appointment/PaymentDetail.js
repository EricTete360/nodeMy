const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Create Schema
const PaymentDetailSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users',
	},
    orderId: {
		type: String,
		required: true
	},
	receiptId: {
		type: String
	},
	paymentId: {
		type: String,
	},
	signature: {
		type: String,
	},
	amount: {
		type: Number
	},
	currency: {
		type: String
	},
	createdAt: {
		type: Date
	},
	status: {
		type: String
	}
});

module.exports = PaymentDetail = mongoose.model('payment_detail_schema', PaymentDetailSchema);