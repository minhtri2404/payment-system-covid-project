const bcrypt = require('bcryptjs');
const DebtHistory = require('../models/debt-history');
const PaymentLimit = require('../models/payment-limit.model');

// Hash password with bcrypt
exports.hashPassword = (password = '') => {
	return new Promise((resolve, reject) => {
		bcrypt.genSalt(Number(process.env.BCRYPT_SALT) || 10, function (err, salt) {
			if (err) reject(err);

			bcrypt.hash(password, salt, function (hashErr, hash) {
				if (hashErr) reject(hashErr);
				resolve(hash);
			});
		});
	});
};

exports.formatCurrency = (money = 0) => {
	return new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: 'VND',
	}).format(money);
};

// format date
exports.formatDateToStr = (date) => {
	const d = new Date(date);

	const s = `0${d.getSeconds()}`.slice(-2);
	const m = `0${d.getMinutes()}`.slice(-2);
	const h = `0${d.getHours()}`.slice(-2);

	const y = d.getFullYear();
	const mm = `0${d.getMonth() + 1}`.slice(-2);
	const dd = `0${d.getDate()}`.slice(-2);

	return `${h}:${m}:${s} ${dd}-${mm}-${y}`;
};

exports.getUserDebt = async (accountId) => {
	try {
		const userDebt = await DebtHistory.findOne({
			raw: true,
			where: { accountId: Number(accountId) },
		});

		if (!userDebt) {
			return null;
		}

		const { debt, returned, status, createdTime } = userDebt;

		return {
			debt,
			returned,
			remainingDebt: debt - returned,
			status,
			createdTime,
		};
	} catch (error) {
		console.error('Function getUserDebt Error: ', error);
		return null;
	}
};

exports.getPaymentLimit = async () => {
	try {
		return PaymentLimit.findOne({ raw: true });
	} catch (error) {
		return {};
	}
};
