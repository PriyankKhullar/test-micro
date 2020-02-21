const express = require('express');
const app = express();

const users = require('./routes/users');
const formData = require("express-form-data");
const formDataOptions = require('./config/form-data');

app.use(formData.parse(formDataOptions));
app.use(formData.format());
app.use(formData.stream());
app.use(formData.union());

app.use('/', users);

app.listen(3000, () => {
    console.log('Server is up and running on port numner ' + 3000);
});