const express = require('express');
const app = express();

const auth = require('./routes/auth');
const formData = require("express-form-data");
const formDataOptions = require('./config/form-data');

app.use(formData.parse(formDataOptions));
app.use(formData.format());
app.use(formData.stream());
app.use(formData.union());

app.use('/', auth);

app.listen(3000, () => {
    console.log('Server is up and running on port numner ' + 3000);
});