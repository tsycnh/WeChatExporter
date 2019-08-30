/*

    debugout.js
    by @inorganik
    
*/

// save all the console.logs
function debugout() {
	var self = this;

	// OPTIONS
	self.realTimeLoggingOn = true; // log in real time (forwards to console.log)
	self.useTimestamps = false; // insert a timestamp in front of each log
	self.useLocalStorage = false; // store the output using window.localStorage() and continuously add to the same log each session
	self.recordLogs = true; // set to false after you're done debugging to avoid the log eating up memory
	self.autoTrim = true; // to avoid the log eating up potentially endless memory
	self.maxLines = 2500; // if autoTrim is true, this many most recent lines are saved
	self.tailNumLines = 100; // how many lines tail() will retrieve
	self.logFilename = 'debugout.txt'; // filename of log downloaded with downloadLog()
	self.maxDepth = 25; // max recursion depth for logged objects

	// vars
	self.depth = 0;
	self.parentSizes = [0];
	self.currentResult = '';
	self.startTime = new Date();
	self.output = '';

	this.version = function() { return '0.5.0' }

	/*
		USER METHODS
	*/	
	this.getLog = function() {
		var retrievalTime = new Date();
		// if recording is off, so dev knows why they don't have any logs
		if (!self.recordLogs) {
			self.log('[debugout.js] log recording is off.');
		}
		// if using local storage, get values
		if (self.useLocalStorage) {
			var saved = window.localStorage.getItem('debugout.js');
			if (saved) {
				saved = JSON.parse(saved);
				self.startTime = new Date(saved.startTime);
				self.output = saved.log;
				retrievalTime = new Date(saved.lastLog);
			}
		}
		return self.output
			+ '\n---- Log retrieved: '+retrievalTime+' ----\n'
			+ self.formatSessionDuration(self.startTime, retrievalTime);
	}
	// accepts optional number or uses the default for number of lines
	this.tail = function(numLines) {
		var numLines = numLines || self.tailLines;
		return self.trimLog(self.getLog(), numLines);
	}
	// accepts a string to search for
	this.search = function(string) {
		var lines = self.output.split('\n');
		var rgx = new RegExp(string);
		var matched = [];
		// can't use a simple Array.prototype.filter() here
		// because we need to add the line number
		for (var i = 0; i < lines.length; i++) {
			var addr = '['+i+'] ';
			if (lines[i].match(rgx)) {
				matched.push(addr + lines[i]);
			}
		}
		var result = matched.join('\n');
		if (result.length == 0) result = 'Nothing found for "'+string+'".';
		return result
	}
	// accepts the starting line and how many lines after the starting line you want
	this.getSlice = function(lineNumber, numLines) {
		var lines = self.output.split('\n');
		var segment = lines.slice(lineNumber, lineNumber + numLines);
		return segment.join('\n');
	}
	// immediately downloads the log - for desktop browser use
	this.downloadLog = function() {
	    var logFile = self.getLog();
            var blob = new Blob([logFile], { type: 'data:text/plain;charset=utf-8' });
            var a = document.createElement('a');
            a.href = window.URL.createObjectURL(blob);
            a.target = '_blank';
            a.download = self.logFilename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(a.href);
	}
	// clears the log
	this.clear = function() {
		var clearTime = new Date();
		self.output = '---- Log cleared: '+clearTime+' ----\n';
		if (self.useLocalStorage) {
			// local storage
			var saveObject = {
				startTime: self.startTime,
				log: self.output,
				lastLog: clearTime
			}
			saveObject = JSON.stringify(saveObject);
			window.localStorage.setItem('debugout.js', saveObject);
		}
		if (self.realTimeLoggingOn) console.log('[debugout.js] clear()');
	}
	// records a log
	this.log = function(obj) {
		// log in real time
		if (self.realTimeLoggingOn) console.log(obj);
		// record log
		var type = self.determineType(obj);
		if (type != null && self.recordLogs) {
			var addition = self.formatType(type, obj);
			// timestamp, formatted for brevity
			if (self.useTimestamps) {
				var logTime = new Date();
				self.output += self.formatTimestamp(logTime);
			}
			self.output += addition+'\n';
			if (self.autoTrim) self.output = self.trimLog(self.output, self.maxLines);
			// local storage
			if (self.useLocalStorage) {
				var last = new Date();
				var saveObject = {
					startTime: self.startTime,
					log: self.output,
					lastLog: last
				}
				saveObject = JSON.stringify(saveObject);
				window.localStorage.setItem('debugout.js', saveObject);
			}
		}
		self.depth = 0;
		self.parentSizes = [0];
		self.currentResult = '';
	}
	/*
		METHODS FOR CONSTRUCTING THE LOG
	*/

	// like typeof but classifies objects of type 'object'
	// kept separate from formatType() so you can use at your convenience!
	this.determineType = function(object) {
		if (object != null) {
			var typeResult;
			var type = typeof object;
			if (type == 'object') {
				var len = object.length;
				if (len == null) {
					if (typeof object.getTime == 'function') {
						typeResult = 'Date';
					}
					else if (typeof object.test == 'function') {
						typeResult = 'RegExp';
					}
					else {
						typeResult = 'Object';
					}
				} else {
					typeResult = 'Array';
				}
			} else {
				typeResult = type;
			}
			return typeResult;
		} else {
			return null;
		}
	}
	// format type accordingly, recursively if necessary
	this.formatType = function(type, obj) {
		if (self.maxDepth && self.depth >= self.maxDepth) {
			return '... (max-depth reached)';
		}

		switch(type) {
			case 'Object' :
				self.currentResult += '{\n';
				self.depth++;
				self.parentSizes.push(self.objectSize(obj));
				var i = 0;
				for (var prop in obj) {
					self.currentResult += self.indentsForDepth(self.depth);
					self.currentResult += prop + ': ';
					var subtype = self.determineType(obj[prop]);
					var subresult = self.formatType(subtype, obj[prop]);
					if (subresult) {
						self.currentResult += subresult;
						if (i != self.parentSizes[self.depth]-1) self.currentResult += ',';
						self.currentResult += '\n';
					} else {
						if (i != self.parentSizes[self.depth]-1) self.currentResult += ',';
						self.currentResult += '\n';
					}
					i++;
				}
				self.depth--;
				self.parentSizes.pop();
				self.currentResult += self.indentsForDepth(self.depth);
				self.currentResult += '}';
				if (self.depth == 0) return self.currentResult;
				break;
			case 'Array' :
				self.currentResult += '[';
				self.depth++;
				self.parentSizes.push(obj.length);
				for (var i = 0; i < obj.length; i++) {
					var subtype = self.determineType(obj[i]);
					if (subtype == 'Object' || subtype == 'Array') self.currentResult += '\n' + self.indentsForDepth(self.depth);
					var subresult = self.formatType(subtype, obj[i]);
					if (subresult) {
						self.currentResult += subresult;
						if (i != self.parentSizes[self.depth]-1) self.currentResult += ', ';
						if (subtype == 'Array') self.currentResult += '\n';
					} else {
						if (i != self.parentSizes[self.depth]-1) self.currentResult += ', ';
						if (subtype != 'Object') self.currentResult += '\n';
						else if (i == self.parentSizes[self.depth]-1) self.currentResult += '\n';
					}
				}
				self.depth--;
				self.parentSizes.pop();
				self.currentResult += ']';
				if (self.depth == 0) return self.currentResult;
				break;
			case 'function' :
				obj += '';
				var lines = obj.split('\n');
				for (var i = 0; i < lines.length; i++) {
					if (lines[i].match(/\}/)) self.depth--;
					self.currentResult += self.indentsForDepth(self.depth);
					if (lines[i].match(/\{/)) self.depth++;
					self.currentResult += lines[i] + '\n';
				}
				return self.currentResult;
				break;
			case 'RegExp' :
				return '/'+obj.source+'/';
				break;
			case 'Date' :
			case 'string' : 
				if (self.depth > 0 || obj.length == 0) {
					return '"'+obj+'"';
				} else {
					return obj;
				}
			case 'boolean' :
				if (obj) return 'true';
				else return 'false';
			case 'number' :
				return obj+'';
				break;
		}
	}
	this.indentsForDepth = function(depth) {
		var str = '';
		for (var i = 0; i < depth; i++) {
			str += '\t';
		}
		return str;
	}
	this.trimLog = function(log, maxLines) {
		var lines = log.split('\n');
		if (lines.length > maxLines) {
			lines = lines.slice(lines.length - maxLines);
		}
		return lines.join('\n');
	}
	this.lines = function() {
		return self.output.split('\n').length;
	}
	// calculate testing time
	this.formatSessionDuration = function(startTime, endTime) {
		var msec = endTime - startTime;
		var hh = Math.floor(msec / 1000 / 60 / 60);
		var hrs = ('0' + hh).slice(-2);
		msec -= hh * 1000 * 60 * 60;
		var mm = Math.floor(msec / 1000 / 60);
		var mins = ('0' + mm).slice(-2);
		msec -= mm * 1000 * 60;
		var ss = Math.floor(msec / 1000);
		var secs = ('0' + ss).slice(-2);
		msec -= ss * 1000;
		return '---- Session duration: '+hrs+':'+mins+':'+secs+' ----'
	}
	this.formatTimestamp = function(timestamp) {
		var year = timestamp.getFullYear();
		var date = timestamp.getDate();
		var month = ('0' + (timestamp.getMonth() +1)).slice(-2);
		var hrs = Number(timestamp.getHours()); 
		var mins = ('0' + timestamp.getMinutes()).slice(-2);
		var secs = ('0' + timestamp.getSeconds()).slice(-2);
		return '['+ year + '-' + month + '-' + date + ' ' + hrs + ':' + mins + ':'+secs + ']: ';
	}
	this.objectSize = function(obj) {
	    var size = 0, key;
	    for (key in obj) {
	        if (obj.hasOwnProperty(key)) size++;
	    }
	    return size;
	}

	/*
		START/RESUME LOG
	*/
	if (self.useLocalStorage) {
		var saved = window.localStorage.getItem('debugout.js');
		if (saved) {
			saved = JSON.parse(saved);
			self.output = saved.log;
			var start = new Date(saved.startTime);
			var end = new Date(saved.lastLog);
			self.output += '\n---- Session end: '+saved.lastLog+' ----\n';
			self.output += self.formatSessionDuration(start, end);
			self.output += '\n\n';
		}
	} 
	self.output += '---- Session started: '+self.startTime+' ----\n\n';
}
