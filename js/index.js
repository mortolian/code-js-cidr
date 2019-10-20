function nextTab(element, event) {
    event.preventDefault();
    let nextTab = Number(element.getAttribute('tabindex')) + 1;
    if(nextTab <= 5 && nextTab >= 1) {
        let toTab = document.querySelector('input[tabindex="' + nextTab + '"]');
        toTab.focus();
    }
}

function previousTab(element, event) {
    event.preventDefault();
    let nextTab = Number(element.getAttribute('tabindex')) - 1;
    if(nextTab <= 5 && nextTab >= 1) {
        let toTab = document.querySelector('input[tabindex="' + nextTab + '"]');
        toTab.focus();
    }
}

function copyToClipboard(elm) {
    var range = document.createRange();
    range.selectNode(elm);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
}

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

function populateInformation(elementId, info) {
    let element = document.getElementById(elementId);
    
    if(info instanceof Array) {
        info = info.join('.');
        infoHTML = '';
    }

    element.innerHTML = info;
}



let octets = window.document.querySelectorAll("#ip4 input");

Array.from(octets).forEach(function(element) {

    element.addEventListener('keyup', function(event) {
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
            console.log(ipInfo);

            // draw all the values if validation passed
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
    });

    element.addEventListener('keydown', function(event) {        
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
        if(this.className.includes("octet")) {
            const testPatterm = /[0-9]{1,2}/;        
            let newValue = Number(this.value + event.key);

            if(!testPatterm.test(newValue) || (newValue < 0 || newValue > 255)) {
                event.preventDefault();
            }
            return;
        }
        
        // Test CIDR value
        if(this.className.includes("cidr")) {
            const testPatterm = /[0-9]{1,2}/;        
            let newValue = Number(this.value + event.key);

            if(!testPatterm.test(newValue) || (newValue < 0 || newValue > 32)) {
                event.preventDefault();
            }
            return;
        }
    });
});