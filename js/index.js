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
 * This will execute an animation.
 * 
 * @param {*} elm 
 */
function animateIpBookmark(elm) {
    elm.classList.add("animated", "swing");
    elm.addEventListener('animationend', function(event) {
        elm.classList.remove("animated", "swing");
    });
}

/**
 * This will handle printing
 */
function printPage(event) {
    window.print();
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
 * This will grab the IP data from the input boxes.
 */
function grabIPInput() {
    // grab all the information and generate the required calculation string
    let octet1 = document.querySelector('input[name="ip4-octet-1"]').value;
    let octet2 = document.querySelector('input[name="ip4-octet-2"]').value;
    let octet3 = document.querySelector('input[name="ip4-octet-3"]').value;
    let octet4 = document.querySelector('input[name="ip4-octet-4"]').value;
    let cidr = document.querySelector('input[name="ip4-cidr"]').value;

    // validate all the values
    let valid = false;
    if(octet1 && octet2 && octet3 && octet4 && cidr) {
        return String(octet1 + '.' + octet2 + '.' + octet3 + '.' + octet4 + '/' + cidr);
    }

    return false;
}

/**
 * This will populate the IP address selection with the given IP
 * data.
 * 
 * @param {*} oct1 
 * @param {*} oct2 
 * @param {*} oct3 
 * @param {*} oct4 
 * @param {*} cidr 
 */
function setInputValues(oct1, oct2, oct3, oct4, cidr) {
    // grab all the information and generate the required calculation string
    let octet1 = document.querySelector('input[name="ip4-octet-1"]');
    let octet2 = document.querySelector('input[name="ip4-octet-2"]');
    let octet3 = document.querySelector('input[name="ip4-octet-3"]');
    let octet4 = document.querySelector('input[name="ip4-octet-4"]');
    let cidrInput = document.querySelector('input[name="ip4-cidr"]');
  
    octet1.value = oct1;
    octet2.value = oct2;
    octet3.value = oct3;
    octet4.value = oct4;
    cidrInput.value = cidr;

}

/**
 * This will execute the calculation required when the IP is completely
 * filled in and valid. It will also populate the result to the page.
 * 
 * @param {object} event The event object
 */
function doCalculation(event) {
    let ipString = grabIPInput();
    
    // Information display
    let resultElement = document.getElementById("calculation");

    if(ipString) {    
        // Turn on information display
        resultElement.classList.replace('hide', 'display');

        // do the calculation if validation passed
        let ipInfo = calcIpv4AddressesFromString(ipString);     

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

// This will manage all the bookmarking functionality
function addBookmark(event) {
    let ipString = grabIPInput();
    let ipBookmarkArray = [];

    if(!ipString || ipString === "") {
        return;
    }

    if(localStorage.getItem('ipBookmarkArray').length > 0) {
        ipBookmarkArray = JSON.parse(localStorage.getItem('ipBookmarkArray'));
    }

    // Remove any empty items
    ipBookmarkArray.forEach(function(item, index) {
        if(item == "") {
            ipBookmarkArray.splice(index, 1);
        }
    });

    // Avoid duplicates
    if(ipBookmarkArray.includes(ipString)) {
        return;
    }

    // Add new data to array
    ipBookmarkArray.push(ipString);

    // Store data
    localStorage.setItem('ipBookmarkArray', JSON.stringify(ipBookmarkArray));

    // update bookmarks list
    updateBookMarkedList();
}

/**
 * This will remove a bookmark from the bookmarks data
 * and refresh the list on screen
 * 
 * @param {*} elm 
 */
function removeBookmark(elm) {
    let ipString = elm.parentElement.getAttribute('ip');
    let ipBookmarkArray = [];

    if(!ipString || ipString === "") {
        return;
    }

    if(localStorage.getItem('ipBookmarkArray').length > 0) {
        ipBookmarkArray = JSON.parse(localStorage.getItem('ipBookmarkArray'));
    }

    // Remove any empty items and the specified IP string
    ipBookmarkArray.forEach(function(item, index) {
        if(item == "" || item == ipString) {
            ipBookmarkArray.splice(index, 1);
        }
    });

    // Store data
    localStorage.setItem('ipBookmarkArray', JSON.stringify(ipBookmarkArray));

    // update bookmarks list
    updateBookMarkedList();
}

/**
 * This will insert a new bookmark in the list and refresh the
 * on screen list.
 * 
 * @param {*} elm 
 */
function insertBookmark(elm) {
    let ipString = elm.parentElement.getAttribute('ip');
    let ipInfo = calcIpv4AddressesFromString(ipString);

    animateIpBookmark(elm.parentElement);

    setInputValues(
        ipInfo.ip4Address.ipOctetsDecimalArray[0], 
        ipInfo.ip4Address.ipOctetsDecimalArray[1],
        ipInfo.ip4Address.ipOctetsDecimalArray[2],
        ipInfo.ip4Address.ipOctetsDecimalArray[3],
        ipInfo.subnet.ip4CIDR
    );

    doCalculation();
}

/**
 * This will update the bookmark list on screen
 */
function updateBookMarkedList() {
    let bookmarksElement = document.getElementById('bookmarked_ips');
    let bookmarksSectionElement = document.getElementById('bookmarks');

    // get the data
    if(localStorage.getItem('ipBookmarkArray').length > 5) {
        ipBookmarkArray = JSON.parse(localStorage.getItem('ipBookmarkArray'));
        // display the bookmarks element
        bookmarksSectionElement.classList.remove('hide');
    } else {
        // hide the bookmarks element
        bookmarksSectionElement.classList.add('hide');
        return;
    }

    // wipe the present bookmarks
    bookmarksElement.innerHTML = "";
    
    let bookmarksFragment = new DocumentFragment();
    
    ipBookmarkArray.forEach(function(item,index) {
        // create elements
        let li = document.createElement("li");
        let i = document.createElement("i");
        let span = document.createElement("span");
        i.classList.add('far','fa-trash-alt');
        i.setAttribute('onclick', 'removeBookmark(this)')
        i.setAttribute('title', 'Remove from bookmarks');
        span.textContent = item;
        span.setAttribute('onclick', 'insertBookmark(this)');
        li.setAttribute('ip', item);
        li.appendChild(span);
        li.appendChild(i);
        bookmarksFragment.appendChild(li);
    });

    bookmarksElement.appendChild(bookmarksFragment);
}

/**
 * This will load when the document is readdy
 * IFFY
 */
(function() {
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

    // Event listener to add a new bookmark
    let bookmarkElement = document.getElementById('bookmark');
    bookmarkElement.addEventListener('click', addBookmark);
    
    // refresh bookmarks list on initial load
    updateBookMarkedList(); 

    // setup printer event listener
    let printButtonElement = document.getElementById('print');
    printButtonElement.addEventListener('click', printPage);
})();