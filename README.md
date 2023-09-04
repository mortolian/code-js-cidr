# CIDR Calculator

CIDR (Classless Inter-Domain Routing) calculators are simple tools to assist you to calculate a block of IP addresses.

## What is a CIDR Calculator

- https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing

CIDR notation is a compact representation of an IP address and its associated routing prefix. The notation is
constructed from an IP address, a slash ('/') character, and a decimal number. The number is the count of leading 1 bits
in the subnet mask. Larger values here indicate smaller networks. The maximum size of the network is given by the number
of addresses that are possible with the remaining, least-significant bits below the prefix.

The IP address is expressed according to the standards of IPv4 or IPv6. The address may denote a single, distinct
interface address or the beginning address of an entire network. The aggregation of these bits is often called the host
identifier.

## Project Objective

This is a code challenge project where I tried to create a CIDR calculator without
any JavaScript or other libraries.

I am going to add in some libraries to help with development for the new version and also
remove some libraries I used in the past to make it even closer to "no library"
as possible.

## Demo

[![CI Tests](https://github.com/mortolian/code-js-cidr/actions/workflows/ci.yml/badge.svg)](https://github.com/mortolian/code-js-cidr/actions/workflows/ci.yml)
[![Deploy On GitHub Pages](https://github.com/mortolian/code-js-cidr/actions/workflows/github.yml/badge.svg)](https://github.com/mortolian/code-js-cidr/actions/workflows/github.yml)

- https://mortolian.github.io/code-js-cidr