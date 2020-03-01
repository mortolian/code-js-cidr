/**
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators
 */
function octetDecimalToBinary(decimal) {    
    if (decimal < 0 || decimal > 255 || decimal % 1 !== 0) {
        throw new Error(n + " does not fit in a byte");
    }
    return ("000000000" + decimal.toString(2)).substr(-8)
}

function octetBinaryToDecimal(binary) {
    return parseInt(binary,2).toString(10);
}

function calculateIpFromBinaryArray(binaryArray) {
    let octetsBinaryStringArray = [];
    let octetsDecimalArray = [];

    let binaryString = binaryArray.join("");

    for (o=0; o<4; o++) {
        let startArrayGrab = o * 8;
        let endArrayGrab = (startArrayGrab + 8) - 1;
        octetsBinaryStringArray[o] = binaryString.substr(startArrayGrab,8);
        octetsDecimalArray[o] = octetBinaryToDecimal(octetsBinaryStringArray[o]);
    }
    return {
        ipBinaryArray: binaryArray,
        ipOctetsBinaryStringArray: octetsBinaryStringArray,
        ipOctetsDecimalArray: octetsDecimalArray
    }
}

function calculateSubnetClass(ip4BinaryArray) {    
    const ip4BinaryString = ip4BinaryArray.join('');
    const classPatternA = /^0/;
    const classPatternB = /^10/;
    const classPatternC = /^110/;

    if(classPatternA.test(ip4BinaryString)) { return "A"; }
    if(classPatternB.test(ip4BinaryString)) { return "B"; }
    if(classPatternC.test(ip4BinaryString)) { return "C"; }
       
    return false;
}

function netmaskFromCIDR(cidr) {
    // calculate the netmask 
    let cidrBinaryArray = [];
    let octetsBinaryArray = [];
    let octetsDecimalArray = [];
    let ip4SubnetWildCardArray = [];
    let ip4Subnet = {};

    // Calculate the complete CIDR binary array    
    let i;
    let c = cidr;

    for (i=0; i<32; i++) {
        if (c > i) {
            cidrBinaryArray[i] = 1;
            continue;
        }
        cidrBinaryArray[i] = 0;
    }

    // Calculate the octet binary and the octet decimal
    ip4Subnet = calculateIpFromBinaryArray(cidrBinaryArray);
    ip4SubnetWildCardBinaryArray = cidrBinaryArray.map(function(element) {
        if(element === 1) {
            return 0;
        }
        return 1;
    });

    // return an object with all the subnet calculations
    return {
        ip4CIDR: cidr,
        ip4CIDRBinary: cidrBinaryArray,
        ip4Subnet: ip4Subnet,
        ip4ip4SubnetWildCard: calculateIpFromBinaryArray(ip4SubnetWildCardBinaryArray),
        ip4Addresses: Math.pow(2,32-cidr),
        ip4Hosts: Math.pow(2,32-cidr)-2,
    }
}

function calcIpv4AddressesFromString(str) {
    // split the subnet from ip  
    let [ip4String,cidrString] = str.split('/');

    // split the ip in string octets
    let ip4StringArray = ip4String.split('.');

    // convert everything to number/int
    let ip4IntArray = ip4StringArray.map(Number);
    let cidrInt = Number(cidrString);

    // call and return the ip calculations
    return calcIpv4Addresses(ip4IntArray, cidrInt);
}

function calcIpv4Addresses(ip4,cidr) {
    // do subnet calculations and get object with values
    const subnet = netmaskFromCIDR(cidr);
    
    let ip4BinaryArray = [];
    let o;

    for (o=0; o < 4; o++) {
        // calculate IP binary
        ip4BinaryArray = ip4BinaryArray.concat(octetDecimalToBinary(ip4[o]).split('').map(Number));
    }

    let networkIpBinary = [];
    let broadcastIpBinary = [];
    let n;

    for (n = 0; n < 32; n++) {
        if (n > (cidr-1)) {
            networkIpBinary[n] = 0;
            broadcastIpBinary[n] = 1;
        } else {
            networkIpBinary[n] = ip4BinaryArray[n];
            broadcastIpBinary[n] = ip4BinaryArray[n];
        }
    }

    let firstIpBinary = Array.from(networkIpBinary);
    firstIpBinary[30] = 0;
    firstIpBinary[31] = 1;
        
    var lastIpBinary = Array.from(broadcastIpBinary);    
    lastIpBinary[31] = 1;
    lastIpBinary[31] = 0;

    // Create a plain string of the IP Address
    var ip4AddressString = ip4.join(".") + "/" + cidr;

    // Return Result
    return {
        ip4AddressString: ip4AddressString,
        ip4Address: calculateIpFromBinaryArray(ip4BinaryArray),
        ip4Network: calculateIpFromBinaryArray(networkIpBinary),
        ip4Broadcast: calculateIpFromBinaryArray(broadcastIpBinary),
        ip4FirstHost: calculateIpFromBinaryArray(firstIpBinary),
        ip4LastHost: calculateIpFromBinaryArray(lastIpBinary),
        ip4Class: calculateSubnetClass(ip4BinaryArray),
        subnet: subnet
    };
}