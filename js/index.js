/*
This JS file contains all the code which help with the functioning
of the CIDR page.
*/


/**
 * This will pass the cursor to the next input element
 * 
 * @param {object} element Element object 
 * @param {object} event Event object
 */
function nextTab(element, event) {
    event.preventDefault();
    let nextTab = Number(element.getAttribute('tabindex')) + 1;
    if(nextTab <= 5 && nextTab >= 1) {
        let toTab = document.querySelector('input[tabindex="' + nextTab + '"]');
        toTab.focus();
    }
}


/**
 * This will pass the cursor to the previos input element
 * 
 * @param {object} element Element object 
 * @param {object} event Event object
 */
function previousTab(element, event) {
    event.preventDefault();
    let nextTab = Number(element.getAttribute('tabindex')) - 1;
    if(nextTab <= 5 && nextTab >= 1) {
        let toTab = document.querySelector('input[tabindex="' + nextTab + '"]');
        toTab.focus();
    }
}

/**
 * This will execute the animation for copying items on the page.
 * 
 * @param {*} elm 
 */
function animateCopyToClipBoard(elm) {
    elm.classList.add("animated", "rubberBand");
    elm.addEventListener('animationend', function(event) {
        elm.classList.remove("animated", "rubberBand");
    });
}

/**
 * This will copy the text contained in an elements innerHTML
 * 
 * @param {object} elm Element object
 */
function copyToClipboard(elm) {
    animateCopyToClipBoard(elm);

    var range = document.createRange();
    range.selectNode(elm);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
}


/**
 * This will format a number for display
 * 
 * @param {number} num Number to format
 */
function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}


/**
 * This is a helper function that will pupulate the information for an
 * element on the page based on its ID.
 * 
 * @param {string} elementId 
 * @param {string} info 
 */
function populateInformation(elementId, info) {
    let element = document.getElementById(elementId);
    let colorClassArray = ["blue", "red", "yellow", "green"];
    let defaultColorClass = "grey";
  
    // First, normalise any arrays to strings, because ultimately even if
    // the content is not recognised, we can always output the string.
    if(info instanceof Array) {
        info = info.join('.');
    }
  
    // Colour a base 10 or 2 octet
    const checkOctetBinary = /(^[0-1]{8}.[0-1]{8}.[0-1]{8}.[0-1]{8}$)|(^[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}$)/;
    if(checkOctetBinary.test(info)) {
      let infoArray = info.split(".");
      
      infoArray.forEach(function(octet,index,infoArray) {
         infoArray[index] = '<span class="' + colorClassArray[index] + '">' + octet + '</span>';
      });
      info = infoArray.join('.');
    }
    
    // check to see if CIDR binary, and then style
    const checkCIDRBinary = /^[0-1.]{63}$/;
    if(checkCIDRBinary.test(info)) {
        let infoArray = info.split(".");
        
        infoArray.forEach(function(bit,index,infoArray) {
          // calculate which octet the bit belongs to
          let octetNum = Math.floor(index / 8);
          let color = defaultColorClass; 
          let count = 1;
          
          if(bit == '1') {
             color = colorClassArray[octetNum];
          }
          
          // decorate
          infoArray[index] = '<span class="' + color + '">' + bit + '</span>';
        });
      
        for (let i = 1; i < 4; i++) {
          let index = ((i * 8) + i)-1;
          infoArray.splice(index, 0, '.');  
        }
       
        info = infoArray.join('');
    }
  
    // insert info on the page in the element ID specified
    element.innerHTML = info;
}


/**
 * This will execute the calculation required when the IP is completely
 * filled in and valid. It will also populate the result to the page.
 * 
 * @param {object} event The event object
 */
function doCalculation(event) {
    // grab all the information and generate the required calculation string
    let octet1 = document.querySelector('input[name="ip4-octet-1"]').value;
    let octet2 = document.querySelector('input[name="ip4-octet-2"]').value;
    let octet3 = document.querySelector('input[name="ip4-octet-3"]').value;
    let octet4 = document.querySelector('input[name="ip4-octet-4"]').value;
    let cidr = document.querySelector('input[name="ip4-cidr"]').value;

    // validate all the values
    let valid = false;
    if(octet1 && octet2 && octet3 && octet4 && cidr) {
        valid = true;
    }

    // Information display
    let resultElement = document.getElementById("calculation");

    if(valid) {
        // Turn on information display
        resultElement.classList.replace('hide', 'display');

        // do the calculation if validation passed
        let ipInfo = calcIpv4AddressesFromString(octet1 + '.' + octet2 + '.' + octet3 + '.' + octet4 + '/' + cidr);     

        // draw all the values if validation passed
        populateInformation('ip-value', ipInfo.ip4AddressString);

        populateInformation('cidr-value', ipInfo.subnet.ip4CIDR);
        populateInformation('cidr-bin', ipInfo.subnet.ip4CIDRBinary);
        
        populateInformation('networkip-ip4', ipInfo.ip4Network.ipOctetsDecimalArray);
        populateInformation('networkip-bin', ipInfo.ip4Network.ipOctetsBinaryStringArray);
        
        populateInformation('broadcastip-ip4', ipInfo.ip4Broadcast.ipOctetsDecimalArray);
        populateInformation('broadcastip-bin', ipInfo.ip4Broadcast.ipOctetsBinaryStringArray);
        
        populateInformation('first-host-ip4', ipInfo.ip4FirstHost.ipOctetsDecimalArray);
        populateInformation('first-host-bin', ipInfo.ip4FirstHost.ipOctetsBinaryStringArray);

        populateInformation('last-host-ip4', ipInfo.ip4LastHost.ipOctetsDecimalArray);
        populateInformation('last-host-bin', ipInfo.ip4LastHost.ipOctetsBinaryStringArray);

        populateInformation('class-ip4', String('Class ' + ipInfo.ip4Class));

        populateInformation('subnet-ip4', ipInfo.subnet.ip4Subnet.ipOctetsDecimalArray);
        populateInformation('subnet-bin', ipInfo.subnet.ip4Subnet.ipOctetsBinaryStringArray);

        populateInformation('subnet-wildcard-ip4', ipInfo.subnet.ip4ip4SubnetWildCard.ipOctetsDecimalArray);
        populateInformation('subnet-wildcard-bin', ipInfo.subnet.ip4ip4SubnetWildCard.ipOctetsBinaryStringArray);

        populateInformation('host-ips-ip4', formatNumber(ipInfo.subnet.ip4Hosts));

        populateInformation('total-ips-ip4', formatNumber(ipInfo.subnet.ip4Addresses));
    } else {
        resultElement.classList.replace('display', 'hide');
    }
}


/**
 * This will check what do do with a keystroke on an input
 * element before it foes anything and then change
 * its behaviour if needed based on state.
 * 
 * @param {object} event The event object
 */
function keyStrokes(event) {

    let tabindex = this.getAttribute("tabindex");

    if(event.shiftKey && event.key == "Tab") {
        previousTab(this, event);
        return;
    }
    if(event.key === "." && tabindex < "4") {
        nextTab(this, event);
        return;
    }
    if(event.key === "/" && tabindex == "4") {
        nextTab(this, event);
        return;            
    }
    if(event.key === "ArrowLeft") {
        previousTab(this, event);
        return;
    }
    if(event.key === "ArrowRight") {
        nextTab(this, event);
        return;
    }
    if(event.key === "ArrowUp") {   
        return;
    }
    if(event.key === "ArrowDown") {
        return;
    }
    if(event.key === "Tab") {
        nextTab(this, event);
    }
    if(event.key === "Backspace") {
        return;
    }
    if(event.key === "Delete") {
        return;
    }

    // Test OCTET value
    // you need to find a better regular expression here.
    if(this.className.includes("octet")) {
        let testPattern = /[0-9]{1,2}/;
        let testZeros = /(^0[1-9]$)|(^00$)/;
        let testAlpha = /^[0-9]*$/
        
        let newValue = this.value + event.key;

        if(testZeros.test(newValue) || !testAlpha.test(newValue) || (Number(newValue) < 0 || Number(newValue) > 255)) {
            event.preventDefault();
        }
        return;
    }
    
    // Test CIDR value
    if(this.className.includes("cidr")) {
        let testPatterm = /[0-9]{1,2}/;        
        let testZeros = /^0/;
    
        let newValue = Number(this.value + event.key);

        if(testZeros.test(newValue) || !testPatterm.test(newValue) || (newValue < 0 || newValue > 32)) {
            event.preventDefault();
        }
        return;
    }
}

// select all the input items
let octets = window.document.querySelectorAll("#ip4 input");

// itteratively add event listeners to the selected input items
Array.from(octets).forEach(function(element) {
    // add a keydown eventlistener to manage keystrokes for the input boxes
    element.addEventListener('keydown', keyStrokes); 

    // add a INPUT event listener to execute the calculation
    element.addEventListener('input', doCalculation);
    
    // add a keyup event listener to execute the calculation
    element.addEventListener('keyup', doCalculation);        
});