(function() {
	// Get some required handles
	var recStatus = $("#recStatus");
	var startRecBtn = $("#startRecButton");
	var stopRecBtn = $("#stopRecButton");
    var resultHTMLElement = $("#resultArea");
    
//    need to find a way to differentiate between computer speech and my speech
//    var lastResult = "";
    
    var rec = null;
    var ss = null;
    var SS_supported = false;
    
    if ('speechSynthesis' in window) {
        // Speech synthesis support
        SS_supported = true;
        ss = new SpeechSynthesisUtterance();
    } else {
        alert("No speech synthesis");   
    }

    try {
		rec = new webkitSpeechRecognition();
	} 
	catch(e) {
    	alert("no speech recognition");
    }

    if (rec) {
		rec.continuous = true;
		rec.interimResults = false;
		rec.lang = 'en';

		// Define a threshold above which we are confident(!) that the recognition results are worth looking at 
		var confidenceThreshold = 0.5;

		// Simple function that checks existence of s in str
		var userSaid = function(str, s) {
			return str.indexOf(s) > -1;
		}

		// Process the results when they are returned from the recogniser
		rec.onresult = function(e) {
			// Check each result starting from the last one
			for (var i = e.resultIndex; i < e.results.length; ++i) {
				// If this is a final result
	       		if (e.results[i].isFinal) {
	       			// If the result is equal to or greater than the required threshold
	       			if (parseFloat(e.results[i][0].confidence) >= parseFloat(confidenceThreshold)) {
		       			var str = e.results[i][0].transcript;
		       			console.log('Recognised: ' + str);
                        speak(str);
                        resultHTMLElement.val(str);
		       			// conditional if the user said 'hello' then parse it further
		       			/*if (userSaid(str, 'hello')) {
                            
		       			}*/
	       			}
	        	}
	    	}
		};
        
        
		// Setup listeners for the start and stop recognition buttons
		startRecBtn.on('click', function(e){
            rec.start();
			recStatus.html('Jarvis is listening');
        });
		stopRecBtn.on('click', function(e){
            rec.stop();
			recStatus.html('Click start to begin');
        });
	}
    
    var speak = function(str) {
        if (SS_supported) {
            ss.text = str;
            window.speechSynthesis.speak(ss);
        }
    };
    
    ss.onstart = function(event) {
        rec.stop();
    };
    
    ss.onend = function(event) {
        rec.start();
    };
    
})();









