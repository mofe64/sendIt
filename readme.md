# sendIT API

[![Coverage Status](https://coveralls.io/repos/github/mofe64/sendIt/badge.svg?branch=master)](https://coveralls.io/github/mofe64/sendIt?branch=master)
[![Build Status](https://travis-ci.com/mofe64/sendIt.svg?branch=master)](https://travis-ci.com/mofe64/sendIt)

**SendIt API Documentation.**

_All Routes with the exception of the signup and login routes are protected and can only be accessed when logged in._

_API LINK_ : <https://sendit-parcelapi.herokuapp.com/>

_Documentation link_ <https://sendit-parcelapi.herokuapp.com/api/v1/docs>

Default Admin Login details username: password:test1234

**Authentication Routes :** There are two authentication routes:

<https://sendit-parcelapi.herokuapp.com/api/v1/auth/register> which is to sign up.

<https://sendit-parcelapi.herokuapp.com/api/v1/auth/login> which is to login.

## Registration

Registration is done via a post request to:
<https://sendit-parcelapi.herokuapp.com/api/v1/auth/register>

when signing-up the following fields must be provided in req.body:

    firstname : test

    lastname : testlastname

    username: testusername

    email : test@example.io

    password : test1234

    passwordconfirm : test1234

upon signing up a jwt token is issued and sent along in the response. This token must be prefixed with Bearer and sent alongside every request in an Authorization header to access restricted routes eg

_if token : 12356789abc_

    "Authorization" : "Bearer 12356789abc"

must be sent alongside every request to a protected route

## Log In

Signing-in All users can log in via a post request to : <https://sendit-parcelapi.herokuapp.com/api/v1/auth/login>

when logging in, the following fields must be provided:

    email: test@example.io

    password: test1234

upon a successful login, a jwt token is issued and sent alongside the response.

This token must be prefixed with Bearer and sent alongside every request in an Authorization header eg

_if token : 12356789abc_

    "Authorization" : "Bearer 12356789abc"

### Note to access any protected route, the above must be sent alongside any request to that protected route, this will validate that the user is actually logged in

---

## CREATING A PARCEL DELIVERY ORDER

You can create a parcel delivery order by making a Post Request to:

<https://sendit-parcelapi.herokuapp.com/api/v1/parcels>

This will create a new parcel delivery order.

The post request should contain the destiantion and presentLocation field in req.body:

    destination: testdestination
    presentLocation: testlocation

### note: the destination field is mandatory and without it the request will fail

### Note: this route is a protected route and a user must be logged in before accessing this route. In addition the currently logged in user's ID is saved on the parcel created and only that user can perform further actions on the parcel

---

## GETTING ALL PARCELS DELIVERY ORDERS

You can get all parcel delivery orders which have been made by making a Get Request to: <https://sendit-parcelapi.herokuapp.com/api/v1/parcels>

This will get all parcels that currently exist in the parcels table.

### NOTE: This route is restricted to admins only

---

## GET AN INDIVIDUAL PARCEL DELIVERY ORDER

You can get a specific parcel delivery order from the parcels table by making Get Request to:

<https://sendit-parcelapi.herokuapp.com/api/v1/parcels/PARCELID/>

### This route is a proteced route and can only be accessed by logged in users

---

## GET ALL PARCEL DELIVERY ORDERS MADE BY A PARTICULAR USER

You can get aLL parcel delivery orders made by a partucular user by making Get Request to:

<https://sendit-parcelapi.herokuapp.com/api/v1/users/USERID/parcels>

### This route is a proteced route and can only be accessed by logged in users

---

## CANCEL A PARCEL DELIVERY ORDER

You can cancel a parcel delivery order by making a Put Request to:

<https://sendit-parcelapi.herokuapp.com/api/v1/parcels/PARCELID/cancel>

### A parcel can only be cancelled by the user who made it, therefore the user who made the parcel delivery must be logged in to access this request

---

## CHANGE A PARCEL DELIVERY ORDER'S DESTINATION

You can change the destination of a parcel delivery order by making a Put Request to:

<https://sendit-parcelapi.herokuapp.com/api/v1/parcels/PARCELID/destination>

### A parcel's destination can only be changed by the user who made it, therefore the user who made the parcel delivery must be logged in to access this request

---

## CHANGE A PARCEL DELIVERY ORDER'S STATUS

You can change a parcel delivery order's status by making a Put Request to:

<https://sendit-parcelapi.herokuapp.com/api/v1/parcels/PARCELID/status>

### A parcel's status can only be changed by the user who made it, therefore the admin must be logged in to access this request

---

## CHANGE A PARCEL DELIVERY ORDER'S PRESENT LOCATION

You can change a parcel delivery order's presentLocation by making a Put Request to:

<https://sendit-parcelapi.herokuapp.com/api/v1/parcels/PARCELID/presentLocation>

### A parcel's present location can only be changed by the user who made it, therefore the admin must be logged in to access this request

---
