var forms = require('forms'),
    fields = forms.fields,
    validators = forms.validators;


exports.buildFeedForm = function() {
	return forms.create({
		website: fields.string({required: true}),
		category: fields.string(),
		url: fields.url()
	})
}

exports.buildUserForm = function() {
	return forms.create({
		email: fields.email()
	})
}