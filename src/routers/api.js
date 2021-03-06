/**
 * MIT License
 *
 * Copyright (C) 2015 - 2018 Moustacheminer Server Services
 * Copyright (C) 2017 - 2018 ls.terminal.ink
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const express = require('express');
const v1 = require('./apirevisions/v1');
const discord = require('./../discord');
const cors = require('cors');

let online;

// Have a status to check if the Discord bot is online or not
discord.on('ready', () => {
	online = true;
});

discord.on('disconnect', () => {
	online = false;
});

const router = express.Router();

// Redirect to the documentation
router.use(cors())
	.get('/', (req, res) => {
		res.redirect('/docs');
	})
	.use((req, res, next) => {
		if (online) {
			next();
		} else {
			res.status(500).json({
				error: 'The webserver has not fully initialised yet. Please try again later'
			});
		}
	})
	.use('/v1', v1) // Version 1
	.use('*', (req, res) => {
		res.status(404).json({ error: 'This API revision does not exist.' });
	});

module.exports = router;
